import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { RootUrlService } from '@progress/sitefinity-nextjs-sdk/rest-sdk';

export const templateRegex = /\/sf\/system\/(?<type>.*?)\/Default\.GetPageTemplates\(selectedPages=(?<selectedPages>.*?)\)/;

export async function middleware(request: NextRequest) {

    // handle known paths
    if (request.nextUrl.pathname.startsWith('/assets') ||
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname === '/favicon.ico') {
        return NextResponse.next();
    }

    if (request.nextUrl.search.indexOf('sfaction') !== -1 && !request.nextUrl.pathname.startsWith('/render')) {
        let newUrl = new URL(`/render-page${request.nextUrl.pathname}${request.nextUrl.search}`, request.url);
        return NextResponse.rewrite(newUrl);
    }

    // handle available templates api call
    const match = request.nextUrl.pathname.match(templateRegex);
    if (match && match.groups) {
        const type = match.groups['type'];
        const selectedPages = match.groups['selectedPages'];

        if (type && selectedPages) {
            let newUrl = new URL(`/api/template-interceptor/${type}`, request.url);
            return NextResponse.rewrite(newUrl);
        }
    }

    // user defined paths that can be additionally proxied
    // can be used for legacy MVC/WebForms pages or paths that are entirely custom
    const whitelistedPaths: string[] = [];

    //handle known CMS paths
    const cmsPaths = [
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
        '/docs',
        '/videos',
        '/forms/submit',
        '/ExtRes',
        '/TranslationRes',
        '/appstatus',
        '/RBinRes'
    ];

    if (request.nextUrl.pathname.indexOf('.axd') !== -1 ||
        whitelistedPaths.some(path => request.nextUrl.pathname.toUpperCase().startsWith(path.toUpperCase())) ||
        cmsPaths.some(path => request.nextUrl.pathname.toUpperCase().startsWith(path.toUpperCase())) ||
        /\/sitefinity(?!\/(template|forms))/i.test(request.nextUrl.pathname)) {

        const {url, headers} = generateProxyRequest(request);

        if (request.method === 'GET' && (request.nextUrl.pathname.indexOf('/sf/system') !== -1 || request.nextUrl.pathname.indexOf('/api/default') !== -1)) {
            // for some reason NextResponse.rewrite double encodes the URL, so this is necessary to remove the encoding
            url.search = decodeEncodedSearchUriWithSpecialCharacters(url.search);
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

    let newUrl = new URL(`/host:${request.nextUrl.host}${request.nextUrl.pathname}${request.nextUrl.search}`, request.url);
    return NextResponse.rewrite(newUrl);
}

function generateProxyRequest(request: NextRequest) {
    const headers = new Headers(request.headers);
    headers.append('X-SFRENDERER-PROXY', 'true');
    if (!headers.has('X-SF-WEBSERVICEPATH')) {
        headers.set('X-SF-WEBSERVICEPATH', RootUrlService.getWebServicePath());
    }

    let resolvedHost = process.env.SF_PROXY_ORIGINAL_HOST || request.nextUrl.host;
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

    const proxyURL = new URL(process.env.SF_CMS_URL!);
    let url = new URL(request.url);
    headers.set('HOST', proxyURL.hostname);

    url.hostname = proxyURL.hostname;
    url.protocol = proxyURL.protocol;
    url.port = proxyURL.port;

    return { url, headers };
}

function decodeEncodedSearchUriWithSpecialCharacters(uri: string) {
    const decoded = decodeURIComponent(uri);

    if (/'/i.test(decoded)) {
        return uri;
    }

    return decoded;
}
