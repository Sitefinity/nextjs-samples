import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { RootUrlService } from '@progress/sitefinity-nextjs-sdk/rest-sdk';

export async function middleware(request: NextRequest) {
    // handle available templates api call
    const regex = /\/sf\/system\/(?<type>.*?)\/Default\.GetPageTemplates\(selectedPages=(?<selectedPages>.*?)\)/;
    const match = request.nextUrl.pathname.match(regex);
    if (match && match.groups) {
        const type = match.groups['type'];
        const selectedPages = match.groups['selectedPages'];

        if (type && selectedPages) {
            let newUrl = new URL(`/api/template-interceptor/${type}?selectedPages=${selectedPages}`, request.url);
            return NextResponse.rewrite(newUrl);
        }
    }

    // handle form render
    if (/\/sitefinity\/forms/i.test(request.nextUrl.pathname) && request.nextUrl.search.indexOf('render=true') !== -1) {
        return NextResponse.next();
    }

    // handle known paths
    if (request.nextUrl.pathname.startsWith('/assets') ||
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname === '/favicon.ico') {
        return NextResponse.next();
    }

    if (!process.env.PROXY_URL) {
        return;
    }

    if (!process.env.SF_ACCESS_KEY && process.env.NODE_ENV === 'production') {
        throw 'No access key found';
    }

    //handle known service paths
    const paths = [
        '/Sitefinity/Services',
        '/Sitefinity/adminapp',
        '/adminapp',
        '/sf/system',
        '/api/default',
        '/ws',
        '/restapi',
        '/contextual-help',
        '/res',
        '/admin-bridge',
        '/sfres',
        '/images',
        '/documents',
        '/videos',
        '/forms/submit',
        '/ExtRes'
    ];

    if (request.nextUrl.pathname.indexOf('.axd') !== -1 ||
        paths.some(path => request.nextUrl.pathname.toUpperCase().startsWith(path.toUpperCase())) ||
        /\/sitefinity(?!\/template)/i.test(request.nextUrl.pathname) ||
        /Action\/(Edit|Preview)/i.test(request.nextUrl.pathname)
        ) {

        const {url, headers} = generateProxyRequest(request);

        if (request.method === 'GET' && (request.nextUrl.pathname.indexOf('/sf/system') !== -1 || request.nextUrl.pathname.indexOf('/api/default') !== -1)) {
            // for some reason NextResponse.rewrite double encodes the URL, so this is necessary to remove the encoding
            url.search = decodeURIComponent(url.search);
            let response = await fetch(url, {
                headers: headers,
                body: null,
                method: request.method,
                credentials: 'include',
                redirect: 'follow'
            }).catch((error) => {
                console.error('There was a problem with the Fetch operation:', error);
            });

            return response;
        }

        return NextResponse.rewrite(url, {
            request: {
                headers: headers
            }
        });
    }

    // proxy everything else and if returns X-SFRENDERER-PROXY, handle it, otherwise - it's a valid response
    const {url, headers} = generateProxyRequest(request);
    return fetch(url, {headers}).then(x => {
        if (x.headers.has('X-SFRENDERER-PROXY')) {
            return NextResponse.next();
        } else {
            if (x.status === 404) {
                // handles 404 pages in the Next.js app
                // if you want to handle them with Sitefinity, remove this part
                return NextResponse.next({status: 404});
            }

            return x;
        }
    });
}

function generateProxyRequest(request: NextRequest) {
    const headers = new Headers(request.headers);
    headers.append('X-SFRENDERER-PROXY', 'true');
    if (!headers.has('X-SF-WEBSERVICEPATH')) {
        headers.set('X-SF-WEBSERVICEPATH', RootUrlService.getWebServicePath());
    }

    let resolvedHost =  process.env.PROXY_ORIGINAL_HOST || request.nextUrl.host;
    if (!resolvedHost) {
        if (process.env.PORT) {
            resolvedHost = `localhost:${process.env.PORT}`;
        } else {
            resolvedHost = 'localhost';
        }
    }

    if (process.env.SF_CLOUD_KEY) {
        // for Sitefinity cloud
        headers.set('X-SF-BYPASS-HOST', resolvedHost);
        headers.set('X-SF-BYPASS-HOST-VALIDATION-KEY', process.env.SF_CLOUD_KEY);
    } else {
        headers.set('X-ORIGINAL-HOST', resolvedHost);
    }

    const proxyURL = new URL(process.env.PROXY_URL!);
    let url = new URL(request.url);
    headers.set('HOST', proxyURL.hostname);

    url.hostname = proxyURL.hostname;
    url.protocol = proxyURL.protocol;
    url.port = proxyURL.port;

    return { url, headers };
}
