import { NextRequest, NextResponse } from 'next/server';
import { middlewares } from './middlewares/middlewares';

export async function middleware(request: NextRequest) {
    return middlewares(request);
}
