# Caching

The NextJS renderer relies on the caching mechanism built by [the framework](https://nextjs.org/docs/app/building-your-application/caching).

Next.js supports various caching mechanisms at different levels, including static generation (SSG), server-side rendering (SSR), and API routes. For static pages, Next.js automatically caches them in the .next directory.

Next.js does not handle database caching out of the box. Database caching would typically be managed by your database system (e.g., Redis, Memcached) or within your API routes using a custom implementation.

Note: The Sitefinity settings for caching per page is not respected. This is a next.js limitation.
You can control the caching of specific pages using getStaticProps (SSG), getServerSideProps (SSR), and getStaticPaths. By setting revalidate, you control when a page should be regenerated and cached.

For libraries, caching is generally handled by the build tools or a CDN, not directly within Next.js.
Images and other static files served from the public directory can be cached by the browser or a CDN.

SDK request caching is also handled by next.js. Every GET request also accepts additionalFetchData params to configure cache per request. This can be set on initServerSideRestSdk for default use on every request. And it also can be confugired in the enviroment file by **SF_SDK_CACHE** and **SF_SDK_CACHE_REVALIDATE** settings. For more information refer to [SDK cache configuration](./../README.md#sdk-cache-configuration).


## Full route cache control

To control caching behavior for a full route, you can set the dynamic property in your layout.tsx or page.tsx files. This determines whether the page is cached statically or revalidated dynamically.

``` tsx
export const dynamic = 'force-dynamic';  // or 'force-static' or 'auto'
```

Options:
- const dynamic = 'force-dynamic'; — Forces dynamic rendering on each request, bypassing any static cache.
- const dynamic = 'force-static'; — Forces static rendering and caches the page for a specific time interval.
- const dynamic = 'auto'; — Allows Next.js to automatically decide based on the presence of dynamic data fetching.

**Note**: When caching with 'force-static', the searchParams in the request context will be empty. If searchParams are needed within a widget, they can be accessed on the client side using useSearchParams from 'next/navigation'.

For more information you can see the next.js documentation for [route handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#behavior) and [full route cache](https://nextjs.org/docs/app/building-your-application/caching#full-route-cache)

## Conditional dynamic routing

When dealing with dynamic routes (e.g., [id].tsx), you can specify whether parameters should be treated dynamically:
``` tsx
export const dynamicParams = true;  // false to disable dynamic routing parameters
```

## Parallel routes and conditional routes

In Next.js, parallel routes allow rendering multiple components or pages simultaneously within different sections of a layout.
Conditional routes dynamically choose which route or component to render based on specific conditions.
For more information you can refer to the next.js documentation about [parallel routes](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes)

## Route a request on a condition

To dynamically set the caching strategy (force-static, auto, force-dynamic) for a route based on conditions like cookies, authentication status, or route segments in Next.js, you can use custom logic within your layout.tsx or page.tsx file.

Use a middleware to check cookies and modify the request headers or the Next.js response accordingly.
``` typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest): NextResponse {
  const hasAuthCookie = request.cookies.getAll().some(cookie => cookie.name.includes('AspNet.Cookies'));
  let dynamic: 'auto' | 'force-static';

  if (hasAuthCookie) {
    dynamic = 'auto';  // set to 'auto' if user is authenticated
  } else {
    dynamic = 'force-static';  // otherwise, cache statically
  }

  request.headers.set('x-dynamic-route', dynamic);

  return NextResponse.next();
}
```

Set dynamic property in page.tsx or layout.tsx by using the custom header or condition directly in the component to determine the dynamic value.
``` typescript
// page.tsx
import { NextRequest } from 'next/server';

export const dynamic = async ({ request }: { request: NextRequest }): Promise<string> => {
  const dynamicSetting = request.headers.get('x-dynamic-route');

  if (dynamicSetting) {
    return dynamicSetting;
  }

  return 'force-dynamic';  // default to dynamic if no condition is met
};

// or using a direct condition:
export const dynamic = (props: Props): string => {
  const hasAuthCookie = props.req.cookies.getAll().some(cookie => cookie.name.includes('AspNet.Cookies'));

  return hasAuthCookie ? 'auto' : 'force-static';
};
```
