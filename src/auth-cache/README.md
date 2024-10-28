# Auth cache

This example demonstrates how to configure caching based on authentication. Refer to the **middlewareCache** function in the [middleware.ts](./src/middleware.ts) for further details.

We check whether the request is made by an authenticated or anonymous user based on the request's cookies.
``` typescript
const hasAuthCookie = request.cookies.getAll().some(cookie => cookie.name.includes('AspNet.Cookies'));
```
If the request is not authenticated, we rewrite it to go through a [custom cached slug](./src/app/cached/[...slug]/page.tsx) where the cache type and revalidation time are configured. We also set an additional header, **x-cached-route-processed**, to indicate that the request has already been processed.
``` typescript
if (!hasAuthCookie && !request.nextUrl.pathname.startsWith('/render-lazy')) {
  const headers = request.headers;
  headers.set('x-cached-route-processed', 'true');

  let url = new URL(request.url);
  url.pathname = '/cached' + request.nextUrl.pathname;

  return NextResponse.rewrite(url, {
    request: {
      headers: headers
    }
  });
}
```
Then, include this **middlewareCache** function into the app's [middleware](./src/middleware.ts) file.
First, we check to ignore all requests that have already been processed by verifying the presence of the **x-cached-route-processed** header.
``` typescript
if (request.headers.has('x-cached-route-processed')) {
  return NextResponse.next();
}
```
Then, add the new step from **middlewareCache**.
``` typescript
const resultCache = await middlewareCache(request);
if (resultCache instanceof Response) {
  return resultCache;
}
```
Create an additional slug, such as **/cached** with a [page.tsx](./src/app/cached/[...slug]/page.tsx), to process the rewritten request. Configure the cache type and revalidation time for this slug according to your specific requirements. The revalidate duration is necessary if you want cache invalidation to occur beyond just when the app is rebuilt. This slug will handle the rewritten request.
``` typescript
export const dynamic = 'force-static';
export const revalidate = 30;
```

For more information about caching, please refer to the [cache documentation](../../docs/Caching.md).

## Project setup
To setup the project follow the instructions [here](./../../README.md#project-setup).
