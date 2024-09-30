import { NextRequest } from 'next/server';

export async function middlewareCache(request: NextRequest) {
    // Configure caching based on authentication
    const hasAuthCookie = request.cookies.getAll().some(cookie => cookie.name.includes('AspNet.Cookies'));
    let dynamic: 'auto' | 'force-static';

    if (hasAuthCookie) {
      dynamic = 'auto';  // set to 'auto' if user is authenticated
    } else {
      dynamic = 'force-static';  // otherwise, cache statically
    }

    request.headers.set('x-dynamic-route', dynamic);

    return request;
}
