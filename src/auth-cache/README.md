# Auth cache

This example demonstrates how to configure caching based on authentication. Refer to the [middleware-cahe](./src/middlewares/middleware-cache.ts) for further details.

We check whether the request is made by an authenticated or anonymous user based on the request's cookies.
``` typescript
const hasAuthCookie = request.cookies.getAll().some(cookie => cookie.name.includes('AspNet.Cookies'));
```
If the request is authenticated, we set the cache to "auto." If the request is anonymous, we set the cache to "force-static."
``` typescript
if (hasAuthCookie) {
      dynamic = 'auto';  // set to 'auto' if user is authenticated
    } else {
      dynamic = 'force-static';  // otherwise, cache statically
    }

    request.headers.set('x-dynamic-route', dynamic);
```
Then, include this [middleware-cache](./src/middlewares/middleware-cache.ts) into the app's [middleware](./src/middleware.ts) file.
``` typescript
const resultCache = await middlewareCache(request);
    request = resultCache;
```

For more information about caching, please refer to the [cache documentation](../../docs/Caching.md).

## Project setup
To setup the project follow the instructions [here](./../../README.md#project-setup).
