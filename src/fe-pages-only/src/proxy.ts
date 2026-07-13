import { NextRequest, NextResponse } from 'next/server';
import { RootUrlService, RENDERER_NAME } from '@progress/sitefinity-nextjs-sdk/rest-sdk';

// Determine if debug logging is enabled (only log in development)
const isDebugEnabled = process.env.NODE_ENV !== 'production';

const headerBypassHostValidationKey = 'X-SF-BYPASS-HOST-VALIDATION-KEY';
const headerBypassHostKey = 'X-SF-BYPASS-HOST';

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

const allProxyPaths = [
    `/${RootUrlService.getWebServicePath()}`,
    '/forms/submit',
    '/sitefinity/anticsrf',
    '/sitefinity/login-handler',
    '/sitefinity/signout/selflog',
    '/ResourcePackages',
    '/web-interface/calendars',
    '/web-interface/events',
    '/kendo',
    ...whitelistedPaths
];

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

    return NextResponse.next();
}

async function proxyMiddleware(request: NextRequest) {
    const bypassHost = shouldBypassHost(request);
    const pathname = request.nextUrl.pathname;

    logWithColor('proxyMiddleware Evaluating proxy conditions', 'magenta', {
        pathname: pathname,
        bypassHost: bypassHost ? '***' : 'none'
    });

    const hasAxd = pathname.indexOf('.axd') !== -1;
    const hasAshx = pathname.indexOf('.ashx') !== -1;
    const matchesProxyPath = allProxyPaths.some((path) => pathname.toUpperCase().startsWith(path.toUpperCase()));
    const isAppStatus = isAppStatusRequest(request);

    logWithColor('proxyMiddleware Proxy condition checks', 'magenta', {
        hasAxd,
        hasAshx,
        matchesProxyPath,
        isAppStatus
    });

    if (
        bypassHost ||
        hasAxd ||
        hasAshx ||
        matchesProxyPath ||
        isAppStatus
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
