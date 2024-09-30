import { NextRequest, NextResponse } from 'next/server';
import { middlewareFrontend } from './middleware-frontend';
import { middlewareBackend } from './middleware-backend';

export async function middlewares(request: NextRequest) {
    const resultFrontend = await middlewareFrontend(request);
    if (resultFrontend instanceof NextResponse) {
        return resultFrontend;
    } else if (resultFrontend instanceof NextRequest) {
        request = resultFrontend;
    }

    const resultBackend = await middlewareBackend(request);
    if (resultBackend instanceof Response) {
        return resultBackend;
    }

    return NextResponse.next();
}
