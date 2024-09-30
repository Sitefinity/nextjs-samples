import { NextRequest, NextResponse } from 'next/server';
import { middlewareFrontend } from './middleware-frontend';

export async function middlewares(request: NextRequest) {
    const resultFrontend = await middlewareFrontend(request);
    if (resultFrontend instanceof NextResponse) {
        return resultFrontend;
    }

    return NextResponse.next();
}
