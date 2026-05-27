import { NextRequest, NextResponse } from 'next/server';
import { RootUrlService, RENDERER_NAME } from '@progress/sitefinity-nextjs-sdk/rest-sdk';

// Determine if debug logging is enabled (only log in development)
const isDebugEnabled = process.env.NODE_ENV !== 'production';

const headerBypassHostValidationKey = 'X-SF-BYPASS-HOST-VALIDATION-KEY';
const headerBypassHostKey = 'X-SF-BYPASS-HOST';

const whitelistedServices: string[] = [];
if (process.env.SF_WHITELISTED_WEBSERVICES) {
    whitelistedServices.push(
        ...process.env.SF_WHITELISTED_WEBSERVICES.split(',').map((x) =>
            x.trim()[0] === '/' ? x.trim() : `/${x.trim()}`
        )
    );
}

const whitelistedNextJsPagePaths: string[] = [];
if (process.env.SF_WHITELISTED_NEXTJS_PATHS) {
    whitelistedNextJsPagePaths.push(
        ...process.env.SF_WHITELISTED_NEXTJS_PATHS.split(',').map((x) =>
            x.trim()[0] === '/' ? x.trim() : `/${x.trim()}`
        )
    );
}

// user defined paths that can be additionally proxied
// can be used for legacy MVC/WebForms pages or paths that are entirely custom
const whitelistedPaths: string[] = [];
if (process.env.SF_WHITELISTED_PATHS) {
    const whiteListedPathsFromEnvironment = (process.env.SF_WHITELISTED_PATHS as string)
        .split(',')
        .map((x) => (x.trim()[0] === '/' ? x.trim() : `/${x.trim()}`));
    whitelistedPaths.push(...whiteListedPathsFromEnvironment);
}

const servicePath = RootUrlService.getWebServicePath();

// Paths that should NOT be proxied even if they match other conditions
const blacklistedProxyPaths = ['/sitefinity/template', '/sitefinity/forms'];

const frontendCmsPaths = [
    `/${servicePath}`,
    '/forms/submit',
    '/sitefinity/anticsrf',
    '/sitefinity/login-handler',
    '/sitefinity/signout/selflog',
    '/ResourcePackages',
    '/web-interface/calendars',
    '/web-interface/events',
    '/kendo'
];

const adminCmsPaths = [
    '/sf/',
    '/sitefinity',
    '/Sitefinity/Services',
    '/Sitefinity/adminapp',
    '/Sitefinity/SignOut',
    '/SFSitemap/',
    '/adminapp',
    '/sf/system',
    '/ws/',
    '/restapi/',
    '/contextual-help',
    '/res/',
    '/admin-bridge/',
    '/sfres/',
    '/images/',
    '/documents/',
    '/docs/',
    '/videos/',
    '/forms/submit',
    '/ExtRes/',
    '/TranslationRes/',
    '/RBinRes/',
    '/ABTestingRes/',
    '/DataIntelligenceConnector/',
    '/signin-facebook',
    '/signin-google',
    '/signin-microsoft',
    '/signin-twitter',
    '/Frontend-Assembly/',
    '/Telerik.Sitefinity.Frontend/'
];

const allProxyPaths = [...frontendCmsPaths, ...adminCmsPaths, ...whitelistedServices, ...whitelistedPaths];

export async function proxy(request: NextRequest) {
    // Short-circuit requests that Next.js handles natively (build output,
    // static assets, favicon). No need to run the CMS proxy logic for these.
    const pathname = request.nextUrl.pathname;

    if (pathname === '/sfrenderer/api/v1/health/status') {
        return new NextResponse(undefined, { status: 200 });
    }

    logWithColor('middleware Processing request', 'cyan', {
        pathname,
        method: request.method,
        timestamp: new Date().toISOString()
    });

    if (
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/assets/') ||
        pathname === '/favicon.ico' ||
        pathname === '/robots.txt' ||
        pathname === '/sitemap.xml' ||
        pathname === '/manifest.json'
    ) {
        logWithColor('middleware Native Next.js resource - skipping CMS proxy', 'cyan');
        return NextResponse.next();
    }

    // Handle whitelisted Next.js pages — these are rendered directly by Next.js
    // without going through CMS proxy logic, just like native Next.js resources.
    if (whitelistedNextJsPagePaths && whitelistedNextJsPagePaths.length > 0) {
        for (let i = 0; i < whitelistedNextJsPagePaths.length; i++) {
            const path = whitelistedNextJsPagePaths[i];
            if (pathname === path) {
                logWithColor('middleware Whitelisted Next.js page path - delegating to Next.js renderer', 'cyan', {
                    path
                });
                return NextResponse.next();
            }
        }
    }

    // 1. Known Sitefinity/CMS paths (services, admin, .axd, whitelisted, etc.)
    //    are proxied directly to the CMS via NextResponse.rewrite — no extra
    //    round-trip, Next.js streams the CMS response straight to the client.
    logWithColor('middleware Checking if path matches known proxy patterns', 'cyan');
    const proxyResult = await proxyMiddleware(request);
    if (proxyResult instanceof Response) {
        logWithColor('middleware Known proxy path - using direct CMS proxy', 'cyan');
        return proxyResult;
    }

    if (process.env.SF_PROXY_BY_DEFAULT === 'true') {
        logWithColor('middleware Proxy by default enabled - proxying request', 'cyan');
        const bypassHost = shouldBypassHost(request);
        return fetchProxiedResponse(request, bypassHost);
    }

    // When proxy by default is not enabled, only known paths are proxied, other requests are handled by Next.js (return NextResponse.next()).
    return NextResponse.next();
}

async function proxyMiddleware(request: NextRequest) {
    const bypassHost = shouldBypassHost(request);
    const pathname = request.nextUrl.pathname;

    logWithColor('proxyMiddleware Evaluating proxy conditions', 'magenta', {
        pathname: pathname,
        bypassHost: bypassHost ? '***' : 'none'
    });

    // Check if path is blacklisted
    if (isPathBlacklisted(pathname)) {
        logWithColor('proxyMiddleware Path is blacklisted - skipping proxy', 'magenta', { pathname });
        return;
    }

    const hasAxd = pathname.indexOf('.axd') !== -1;
    const hasAshx = pathname.indexOf('.ashx') !== -1;
    const matchesProxyPath = allProxyPaths.some((path) => pathname.toUpperCase().startsWith(path.toUpperCase()));
    const isSitefinity = pathname.toLowerCase() === '/sitefinity';
    const isSitefinityRoute = /\/sitefinity\/(?!(template|forms))/i.test(pathname);
    const isAppStatus = isAppStatusRequest(request);
    const isLegacyHome = proxyHomePage(request);

    logWithColor('proxyMiddleware Proxy condition checks', 'magenta', {
        hasAxd,
        hasAshx,
        matchesProxyPath,
        isSitefinity,
        isSitefinityRoute,
        isAppStatus,
        isLegacyHome
    });

    if (
        bypassHost ||
        hasAxd ||
        hasAshx ||
        matchesProxyPath ||
        isSitefinity ||
        isSitefinityRoute ||
        isAppStatus ||
        isLegacyHome
    ) {
        logWithColor('proxyMiddleware Condition matched - proxying request', 'magenta');
        return proxyRequest(request, bypassHost);
    }

    logWithColor('proxyMiddleware No proxy conditions matched', 'magenta');
}

async function proxyRequest(request: NextRequest, bypassHost: string, sendRendererProxyHeaders: boolean = true) {
    logWithColor('proxyRequest Generating proxy request', 'yellow', {
        pathname: request.nextUrl.pathname,
        sendRendererProxyHeaders,
        bypassHost: bypassHost ? '***' : 'none'
    });

    // Rewrite to the CMS URL. Next.js handles the proxying internally and
    // streams the CMS response back to the client without us touching it.
    const { url, headers } = generateProxyRequest(request, bypassHost, sendRendererProxyHeaders);
    const response = NextResponse.rewrite(url, {
        request: {
            headers: headers
        }
    });

    // nextjs issue - overriding of proxied headers is not working
    // https://github.com/vercel/next.js/issues/70515
    if (bypassHost) {
        response.headers.set('sf-cache-control-override', 'no-cache');
        logWithColor('proxyRequest Set cache control override due to bypass host', 'yellow');
    }

    logWithColor('proxyRequest Proxy request created successfully', 'yellow');
    return response;
}

// Handles paths that aren't in our known proxy list. We can't tell from the
// URL alone whether Next.js should render the page or the CMS should serve it
// (e.g. legacy MVC/WebForms pages), so we ask the CMS and let it decide via
// the X-SFRENDERER-PROXY response header.
async function fetchProxiedResponse(request: NextRequest, bypassHost: string) {
    const { url, headers } = generateProxyRequest(request, bypassHost, true);

    logWithColor('fetchProxiedResponse Starting proxy request', 'green', {
        pathname: request.nextUrl.pathname,
        method: request.method,
        bypassHost: bypassHost ? '***' : 'none'
    });

    try {
        // Forward the request to the CMS ourselves (can't use NextResponse.rewrite
        // here because we need to inspect response headers before deciding what
        // to return). redirect:'manual' so CMS redirects reach the browser as-is.
        const proxiedResponse = await fetch(url, {
            method: request.method,
            headers: headers,
            body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.arrayBuffer() : undefined,
            redirect: 'manual'
        });

        logWithColor('fetchProxiedResponse Received proxied response', 'green', {
            status: proxiedResponse.status,
            statusText: proxiedResponse.statusText,
            hasRendererProxyHeader: proxiedResponse.headers.has('X-SFRENDERER-PROXY'),
            contentType: proxiedResponse.headers.get('content-type')
        });

        // CMS signals "this is a renderer page, you render it" by setting
        // X-SFRENDERER-PROXY on the response. In that case we discard the CMS
        // body and let Next.js continue its normal page-rendering pipeline.
        if (proxiedResponse.headers.has('X-SFRENDERER-PROXY')) {
            logWithColor(
                'fetchProxiedResponse X-SFRENDERER-PROXY header found - delegating to Next.js renderer',
                'green'
            );
            return NextResponse.next();
        }

        // If CMS returns a redirect (3xx), pass it through to the browser
        // to preserve Location headers and redirect behavior from the CMS.
        if (proxiedResponse.status >= 300 && proxiedResponse.status < 400) {
            const locationHeader = proxiedResponse.headers.get('location');
            const urlParametersHeader = proxiedResponse.headers.get('urlparameters');

            // Log all response headers for debugging
            const allHeaders: Record<string, string> = {};
            proxiedResponse.headers.forEach((value, key) => {
                allHeaders[key] = value;
            });

            logWithColor('fetchProxiedResponse CMS returned redirect - passing through to browser', 'green', {
                status: proxiedResponse.status,
                locationHeader: locationHeader,
                urlParametersHeader: urlParametersHeader,
                allHeaders: allHeaders
            });

            // If CMS provides urlparameters header, just pass through to Next.js
            // without manipulation - the original request already has the full path
            if (urlParametersHeader && locationHeader) {
                logWithColor('fetchProxiedResponse CMS provided urlparameters - passing to Next.js', 'yellow', {
                    locationHeader: locationHeader,
                    urlParametersHeader: urlParametersHeader
                });
                return NextResponse.next();
            }

            if (!locationHeader) {
                logWithColor(
                    'fetchProxiedResponse Redirect response missing Location header - delegating to Next.js',
                    'yellow'
                );
                return NextResponse.next();
            }

            // NextResponse.redirect() requires absolute URLs. If the CMS returns a relative
            // URL, convert it to absolute using the request's origin.
            let redirectUrl = locationHeader;
            if (!locationHeader.startsWith('http://') && !locationHeader.startsWith('https://')) {
                // Relative URL - make it absolute using the request's origin
                redirectUrl = new URL(locationHeader, request.nextUrl.origin).toString();
            }

            logWithColor('fetchProxiedResponse Redirect URL resolved', 'green', {
                originalLocation: locationHeader,
                resolvedUrl: redirectUrl
            });

            // Use NextResponse.redirect() to properly handle the redirect with Next.js
            const response = NextResponse.redirect(redirectUrl, proxiedResponse.status);

            if (bypassHost) {
                response.headers.set('sf-cache-control-override', 'no-cache');
            }

            return response;
        }

        // If CMS returns an error (4xx/5xx) or other non-success status,
        // delegate to Next.js to handle with custom error pages if available.
        if (proxiedResponse.status < 200 || proxiedResponse.status >= 400) {
            logWithColor(
                'fetchProxiedResponse CMS returned error status - delegating to Next.js error pages',
                'green',
                {
                    status: proxiedResponse.status
                }
            );
            return NextResponse.next();
        }

        logWithColor('fetchProxiedResponse CMS returned 2xx - proxying response directly', 'green');

        // CMS served the content itself (legacy page, static file, etc.)
        // — pass its 2xx response straight through to the client.
        const responseHeaders = new Headers(proxiedResponse.headers);

        // fetch() transparently decodes content-encoding (gzip/br) and buffers the
        // body, so the original content-encoding and content-length no longer
        // match what we're about to send. Drop them so the browser doesn't try to
        // re-decode a plain body or truncate on a stale length.
        responseHeaders.delete('content-encoding');
        responseHeaders.delete('content-length');

        const response = new NextResponse(proxiedResponse.body, {
            status: proxiedResponse.status,
            statusText: proxiedResponse.statusText,
            headers: responseHeaders
        });

        // Same Next.js header-override workaround as in proxyRequest.
        if (bypassHost) {
            response.headers.set('sf-cache-control-override', 'no-cache');
        }

        logWithColor('fetchProxiedResponse Response prepared successfully', 'green');
        return response;
    } catch (error) {
        errorWithColor('fetchProxiedResponse Error fetching proxied response', 'red', {
            pathname: request.nextUrl.pathname,
            error: error instanceof Error ? error.message : String(error)
        });
        throw error;
    }
}

function shouldBypassHost(request: NextRequest) {
    let bypassHost = '';
    const remoteValidationKey = process.env.SF_REMOTE_VALIDATION_KEY;

    if (remoteValidationKey) {
        const hasBypassKey = request.headers.has(headerBypassHostKey);
        const hasValidationKey = request.headers.has(headerBypassHostValidationKey);

        logWithColor('shouldBypassHost Validation key configured - checking headers', 'blue', {
            hasBypassKey,
            hasValidationKey
        });

        if (hasBypassKey && hasValidationKey) {
            const bypassHostKey = request.headers.get(headerBypassHostValidationKey);
            const bypassHostValue = request.headers.get(headerBypassHostKey);

            if (bypassHostKey && bypassHostValue && bypassHostKey === remoteValidationKey) {
                bypassHost = bypassHostValue;
                logWithColor('shouldBypassHost Bypass host validation successful', 'blue');
            } else {
                errorWithColor('shouldBypassHost Validation key mismatch or invalid', 'red');
                throw new Error('The provided validation key is not valid or it has expired.');
            }
        } else {
            logWithColor('shouldBypassHost Validation key configured but headers not present', 'blue');
        }
    } else {
        logWithColor('shouldBypassHost No validation key configured', 'blue');
    }

    return bypassHost;
}

function generateProxyRequest(request: NextRequest, bypassHost: string, sendRendererProxyHeaders: boolean = true) {
    logWithColor('generateProxyRequest Building proxy request headers', 'white', {
        sendRendererProxyHeaders,
        hasCorrelationId: request.headers.has('x-sf-correlation-id'),
        bypassHost: bypassHost ? '***' : 'none',
        requestUrl: request.url,
        requestPathname: request.nextUrl.pathname
    });

    const headers = new Headers(request.headers);
    if (sendRendererProxyHeaders) {
        headers.set('X-SFRENDERER-PROXY', 'true');
        headers.set('X-SFRENDERER-PROXY-NAME', RENDERER_NAME);

        if (!headers.has('X-SF-WEBSERVICEPATH')) {
            headers.set('X-SF-WEBSERVICEPATH', RootUrlService.getWebServicePath());
        }
    }

    if (!headers.has('x-sf-correlation-id')) {
        const correlationId = generateRandomString();
        headers.set('x-sf-correlation-id', correlationId);
        logWithColor('generateProxyRequest Generated correlation ID', 'white', { correlationId });
    }

    let resolvedHost =
        process.env.SF_PROXY_ORIGINAL_HOST || request.headers.get('X-FORWARDED-HOST') || request.nextUrl.host;

    if (!resolvedHost) {
        if (process.env.PORT) {
            resolvedHost = `localhost:${process.env.PORT}`;
        } else {
            resolvedHost = 'localhost';
        }
    }

    logWithColor('generateProxyRequest Resolved host', 'white', { resolvedHost });

    const hostHeaderName = process.env.SF_HOST_HEADER_NAME || 'X-ORIGINAL-HOST';
    if (process.env.SF_LOCAL_VALIDATION_KEY || process.env.SF_REMOTE_VALIDATION_KEY) {
        headers.delete(hostHeaderName);
        if (process.env.SF_LOCAL_VALIDATION_KEY) {
            headers.set(headerBypassHostKey, resolvedHost);
            headers.set(headerBypassHostValidationKey, process.env.SF_LOCAL_VALIDATION_KEY);
            logWithColor('generateProxyRequest Using local validation key', 'white');
        } else if (bypassHost) {
            headers.set(hostHeaderName, bypassHost);
            logWithColor('generateProxyRequest Using bypass host', 'white');
        } else {
            headers.set(hostHeaderName, resolvedHost);
            logWithColor('generateProxyRequest Using resolved host', 'white');
        }
    } else {
        headers.set(hostHeaderName, resolvedHost);
        logWithColor('generateProxyRequest No validation key - using resolved host', 'white');
    }

    const proxyURL = new URL(process.env.SF_CMS_URL!);

    let url: URL;
    try {
        url = new URL(request.url);
    } catch (error) {
        errorWithColor('generateProxyRequest Invalid request.url format - falling back to nextUrl', 'red', {
            requestUrl: request.url,
            requestPathname: request.nextUrl.pathname,
            error: error instanceof Error ? error.message : String(error)
        });
        // Fallback: reconstruct URL from nextUrl (which is already parsed)
        url = new URL(request.nextUrl.href);
    }

    headers.set('HOST', proxyURL.hostname);

    url.hostname = proxyURL.hostname;
    url.protocol = proxyURL.protocol;
    url.port = proxyURL.port;

    logWithColor('generateProxyRequest Proxy URL built', 'white', {
        hostname: proxyURL.hostname,
        protocol: proxyURL.protocol,
        port: proxyURL.port
    });

    return { url, headers };
}

function isAppStatusRequest(request: NextRequest) {
    const pathname = request.nextUrl.pathname.toLowerCase();
    const isAppStatus = pathname === '/appstatus' && request.headers.get('accept')?.indexOf('application/json') !== -1;

    if (isAppStatus) {
        logWithColor('isAppStatusRequest Request is app status request', 'white');
    }

    return isAppStatus;
}

function proxyHomePage(request: NextRequest) {
    // if home page is made with a renderer, it will be handled by the home page logic here in nextjs
    // if it is legacy page (MVC, Web form), proxy the request to Sitefinity
    const isLegacyHomePage: string = process.env.SF_IS_HOME_PAGE_LEGACY || 'false';
    const isLegacy = request.nextUrl.pathname === '/' && isLegacyHomePage.toLocaleLowerCase() === 'true';

    if (isLegacy) {
        logWithColor('proxyHomePage Home page is configured as legacy - will proxy to CMS', 'white');
    } else if (request.nextUrl.pathname === '/') {
        logWithColor('proxyHomePage Home page is not legacy - will use Next.js renderer', 'white');
    }

    return isLegacy;
}

function generateRandomString() {
    let result = '';
    let length = 16;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

function isPathBlacklisted(pathname: string): boolean {
    return blacklistedProxyPaths.some((path) => pathname.toLowerCase().startsWith(path.toLowerCase()));
}

// ANSI color codes for terminal logging
const COLORS = {
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    white: '\x1b[37m',
    red: '\x1b[31m',
    reset: '\x1b[0m'
} as const;

type ColorName = keyof typeof COLORS;

interface LogData {
    [key: string]: unknown;
}

function logWithColor(text: string, color: ColorName = 'white', data?: LogData): void {
    if (!isDebugEnabled) {
        return;
    }
    const colorCode = COLORS[color];
    if (data) {
        console.log(`${colorCode}%s${COLORS.reset}`, text, data);
    } else {
        console.log(`${colorCode}%s${COLORS.reset}`, text);
    }
}

function errorWithColor(text: string, color: ColorName = 'red', data?: LogData): void {
    const colorCode = COLORS[color];
    if (data) {
        console.error(`${colorCode}%s${COLORS.reset}`, text, data);
    } else {
        console.error(`${colorCode}%s${COLORS.reset}`, text);
    }
}
