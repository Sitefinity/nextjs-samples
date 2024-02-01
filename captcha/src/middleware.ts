import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
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

    if (/\/sitefinity\/forms/i.test(request.nextUrl.pathname) && request.nextUrl.search.indexOf('render=true') !== -1) {
        return NextResponse.next();
    }

    if (request.nextUrl.pathname === '/assets' || request.nextUrl.pathname === '/favicon.ico') {
        return NextResponse.next();
    }

    if (!process.env.PROXY_URL) {
        return;
    }

    if (!process.env.SF_ACCESS_KEY && process.env.NODE_ENV === 'production') {
        throw 'No access key found';
    }

    const paths = ['/adminapp', '/sf/system', '/api/default', '/ws', '/restapi', '/contextual-help', '/res', '/admin-bridge', '/sfres', '/images', '/documents', '/videos', '/forms/submit'];

    if (request.nextUrl.pathname.indexOf('.axd') !== -1 || paths.some(path => request.nextUrl.pathname.toUpperCase().startsWith(path.toUpperCase())) || /\/sitefinity(?!\/template)/i.test(request.nextUrl.pathname)) {
        const headers = new Headers(request.headers);
        headers.append('X-Requested-With', 'react');
        headers.append('X-SFRENDERER-PROXY', 'true');

        if (process.env.SF_CLOUD_KEY && process.env.PORT) {
            // for Sitefinity cloud
            headers.append('X-SF-BYPASS-HOST', `localhost:${process.env.PORT}`);
            headers.append('X-SF-BYPASS-HOST-VALIDATION-KEY', process.env.SF_CLOUD_KEY);
        } else if (process.env.PORT) {
            // when using a custom port
            const originalHost = process.env.PROXY_ORIGINAL_HOST || 'localhost';
            headers.append('X-ORIGINAL-HOST', `${originalHost}:${process.env.PORT}`);
        }

        const proxyURL = new URL(process.env.PROXY_URL!);
        let url = new URL(request.url);
        url.hostname = proxyURL.hostname;
        url.protocol = proxyURL.protocol;
        url.port = proxyURL.port;

        if (request.url.indexOf('Default.Hierarchy') !== -1) {
            const parsedParams = new URLSearchParams(url.search);
            parsedParams.delete('$select');
            url.search = parsedParams.toString();
        }

        return NextResponse.rewrite(url, {
            request: {
                headers: headers
            }
        });
    }

    return NextResponse.next();
}
