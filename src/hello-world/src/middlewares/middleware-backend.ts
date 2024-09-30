import { NextRequest, NextResponse } from 'next/server';
import { generateProxyRequest, shouldBypassHost } from './middleware-frontend';

export const templateRegex = /\/sf\/system\/(?<type>.*?)\/Default\.GetPageTemplates\(selectedPages=(?<selectedPages>.*?)\)/;

export async function middlewareBackend(request: NextRequest) {
    let bypassHost = shouldBypassHost(request);

    // handle available templates api call
    const match = request.nextUrl.pathname.match(templateRegex);
    if (!bypassHost && match && match.groups) {
        const type = match.groups['type'];
        const selectedPages = match.groups['selectedPages'];

        if (type && selectedPages) {
            let newUrl = new URL(`/api/template-interceptor/${type}`, request.url);
            return NextResponse.rewrite(newUrl);
        }
    }

    //handle known CMS paths
    const cmsPaths = [
        '/Sitefinity/Services',
        '/Sitefinity/adminapp',
        '/Sitefinity/SignOut',
        '/SFSitemap/',
        '/adminapp',
        '/sf/system',
        '/api/default',
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
        '/Frontend-Assembly/',
        '/Telerik.Sitefinity.Frontend/'
    ];

    if (bypassHost ||
        request.nextUrl.pathname.indexOf('.axd') !== -1 ||
        cmsPaths.some(path => request.nextUrl.pathname.toUpperCase().startsWith(path.toUpperCase())) ||
        request.nextUrl.pathname.toLowerCase() === '/sitefinity' ||
        /\/sitefinity\/(?!(template|forms))/i.test(request.nextUrl.pathname)) {
        const { url, headers } = generateProxyRequest(request, bypassHost);

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

    return request;
}

function decodeEncodedSearchUriWithSpecialCharacters(uri: string) {
    const decoded = decodeURIComponent(uri);

    if (/'/i.test(decoded)) {
        return uri;
    }

    return decoded;
}
