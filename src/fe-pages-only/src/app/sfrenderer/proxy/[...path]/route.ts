export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { RootUrlService } from '@progress/sitefinity-nextjs-sdk/rest-sdk';
import { SF_WEBSERVICE_API_KEY, SF_WEBSERVICE_API_KEY_HEADER } from '@progress/sitefinity-nextjs-sdk/widgets';
import { getProxyHeaders, getHostServerContext, X_SF_RENDERER_REQUEST_HEADER, X_REQUESTED_WITH_HEADER } from '@progress/sitefinity-nextjs-sdk';

const HEADERS_TO_STRIP = ['host', 'connection', 'content-length', 'cookie'];

async function handleRequest(request: NextRequest, params: { path: string[] }): Promise<NextResponse> {
    // CSRF protection – must have a custom header
    const hasRendererHeader = request.headers.has(X_SF_RENDERER_REQUEST_HEADER) || request.headers.has(X_REQUESTED_WITH_HEADER);
    const hasAntiforgeryHeader = request.headers.has('X-SF-ANTIFORGERY-REQUEST');
    if (!hasRendererHeader && !hasAntiforgeryHeader) {
        return new NextResponse(null, { status: 400 });
    }

    const { path } = await params;
    const cmsUrl = RootUrlService.getServerCmsUrl();
    if (!cmsUrl) {
        return new NextResponse('SF_CMS_URL is not configured', { status: 500 });
    }

    const targetPath = path.join('/');
    const search = request.nextUrl.search;
    const targetUrl = `${cmsUrl}/${targetPath}${search}`;

    const headers = new Headers();
    request.headers.forEach((value, key) => {
        if (!HEADERS_TO_STRIP.includes(key.toLowerCase())) {
            headers.set(key, value);
        }
    });

    // request.cookies.getAll() returns raw (already URL-encoded) values as the
    // browser sent them. Forward them verbatim — ASP.NET Core decodes once on its end.
    const cookieHeader = request.cookies.getAll()
        .map(c => `${c.name}=${c.value}`)
        .join('; ');
    if (cookieHeader) {
        headers.set('cookie', cookieHeader);
    }

    const apiKey = process.env[SF_WEBSERVICE_API_KEY];
    if (apiKey) {
        headers.set(SF_WEBSERVICE_API_KEY_HEADER, apiKey);
    }

    const host = getHostServerContext() || request.headers.get('host');
    const proxyHeaders = getProxyHeaders(host!);
    Object.keys(proxyHeaders).forEach((headerKey) => {
        headers.set(headerKey, proxyHeaders[headerKey]);
    });

    const body = request.method !== 'GET' && request.method !== 'HEAD'
        ? await request.arrayBuffer()
        : undefined;

    const upstream = await fetch(targetUrl, {
        method: request.method,
        headers,
        body
    });

    const responseHeaders = new Headers(upstream.headers);
    responseHeaders.delete('content-encoding');
    responseHeaders.delete('content-length');

    return new NextResponse(upstream.body, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers: responseHeaders
    });
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return handleRequest(request, await params);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return handleRequest(request, await params);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return handleRequest(request, await params);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return handleRequest(request, await params);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return handleRequest(request, await params);
}
