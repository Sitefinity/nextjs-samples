import { NextRequest, NextResponse } from 'next/server';
import { middlewares } from './middlewares/middlewares';
import { middlewareCache } from './middlewares/middleware-cache';

export async function middleware(request: NextRequest) {
    const resultCache = await middlewareCache(request);
    request = resultCache;

    return middlewares(request);
}
