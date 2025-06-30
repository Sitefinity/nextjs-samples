# Sitefinity NextJS samples
Examples for practical scenarios with the NextJS renderer

This is a repository contains the samples to demonstrate how to develop your frontend applications with Sitefinity.

## Project setup

1. Clone the repo
To create a project from scratch use the command

``` bash
npx create-next-app nextjs-sitefinity --example "https://github.com/Sitefinity/nextjs-samples/tree/main/src/starter-template"
```

2. Run in the console
``` bash
npm i
```
3. Go to [.env.development file](/.env.development) and set the **'SF_CMS_URL'** variable to point to the URL of the CMS.

4. Create an access key for the user and set it to the **'SF_ACCESS_KEY'** environment variable. For more information, see [Creating Access Keys](https://www.progress.com/documentation/sitefinity-cms/generate-access-key)

## Additional project setup for CMS hosted in Sitefinity cloud

1. In Sitefinity Cloud, navigate to your dedicated Key Vault instance. For more information, see [Azure Key Vault](https://www.progress.com/documentation/sitefinity-cms/cloud/use-key-vault).
Under Secrets, find the LocalValidationKey and copy the value of the secret.

2. Set the **'SF_LOCAL_VALIDATION_KEY'** environment variable with the value of the secret from the above step.

## Additional project setup for Standalone hosting of the CMS

### Case 1 -> CMS is hosted on azure

If your project is hosted on Azure App Services, you need to make some specific settings, so that your Sitefinity CMS can communicate with the Renderer application.

1. Set up a 64-bit process in the App Service platform configuration. To do this, perform the following:
    1. In the Azure portal, click your service.
    2. Under Settings, click Configuration.
    3. Click General settings.
    4. In Platform dropdown box, select 64 Bit.
    5. Restart the app service.
2. Rewrite the X-Original-Host header sent from the Renderer to Host header. To do this, install an additional extension from the Kudu console in the following way:
    1. In the Azure portal, click your service.
    2. In the sidebar, under Development tools section, click Advanced Tools » Go.
    3. In the Kudu console, expand the Site extensions.
    4. Search for the Application Gateway Host Rewrite Module and follow the installation instructions.
    5. Restart the Kudu service.

### Case 2 -> CMS is hosted on a local IIS
1. Host Sitefinity CMS by performing procedure [Run projects on IIS](https://www.progress.com/documentation/sitefinity-cms/run-projects-on-iis).
2. Download the NuGet package [Progress.Sitefinity.Cloud.AppGatewayHostRewriteModule](https://www.nuget.org/packages/Progress.Sitefinity.Cloud.AppGatewayHostRewriteModule/).
3. Change the file extension from .nupkg to .zip and extract the files.
4. In the extracted folder, navigate to the Content folder.
5. Copy the HostRewriteModule.dll and paste in a dedicated folder.

**NOTE: The folder must to be accessible by the IIS. The file must remain in this folder for as long as the extension is used. Deleting the file or its folder can cause issues.**

6. Open Internet Information Services (IIS) Manager.
7. At the top, select your server and click Modules.
8. Click Configure Native Modules » Register.
9. Set the name to AppGatewayHostRewriteModule
10. In Path, navigate to the HostRewriteModule.dll, select it, and click OK.
11. Ensure the checkbox next to AppGatewayHostRewriteModule is selected and click OK.

## Additional project setup for Next.Js Renderer on IIS Hosting (**using HttpPlatformHandler**)

If you wish to host your Next.JS Renderer under IIS, you need to setup IIS to act as a proxy to your original application. For this

1. Install HttpPlatformHandler v1.2
2. Add the following web.config file in the root of the web app (Be sure to replace the paths to node.js and next if they are different !)

``` web.config

<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <handlers>
            <add name="httpPlatformHandler" path="*" verb="*" modules="httpPlatformHandler" resourceType="Unspecified" requireAccess="Script" />
        </handlers>
        <httpPlatform stdoutLogEnabled="true" stdoutLogFile=".\node.log" startupTimeLimit="20" processPath="C:\Program Files\nodejs\node.exe" arguments=".\node_modules\next\dist\bin\next dev">
            <environmentVariables>
                <environmentVariable name="PORT" value="%HTTP_PLATFORM_PORT%" />
                <environmentVariable name="SF_PROXY_ORIGINAL_HOST" value="localhost:8081" />
                <environmentVariable name="NODE_ENV" value="Development" />
            </environmentVariables>
        </httpPlatform>
    </system.webServer>
</configuration>

```

3. Set the **'SF_PROXY_ORIGINAL_HOST'** to the actual domain of the next.js renderer app that will be used for hosting in IIS.

## Additional project setup for Next.Js Renderer when hosted on docker
When the renderer is hosted on docker the resolved host from the http request will be something in the form of 'localhost' or 'localhost:port'. The end result here would be that for every 21st request to a page you would recieve the license page since the domain of 'localhost' is not something registered in the licsense file of the CMS. To adjust for this, please make sure to pass to the X-ORIGINAL-HOST header, the proper value with the actual domain.

If using a single site only you can pass the value through the **'SF_PROXY_ORIGINAL_HOST'** environment variable.
If using a custom header value you can pass the custom header name through the **'SF_HOST_HEADER_NAME'** environment variable.

## File structure

The starter template repository contains a set of files that are built specifically for the integration with the Sitefinity CMS. Some of the files are explained bellow

* next.config.js -> The [standard config file for nextjs](https://nextjs.org/docs/app/api-reference/next-config-js). This file has been modified to sooth the needs of the integration with the CMS. The file can be further modified according to the needs of the application.

* public/assets -> Contains resources such as bootstrap and the default thumbnail for page templates selection in the administration.

* package.json -> Standard package.json file with dependencies for [**@progress/sitefinity-widget-designers-sdk**](https://www.npmjs.com/package/@progress/sitefinity-widget-designers-sdk) and [**@progress/sitefinity-nextjs-sdk**](https://www.npmjs.com/package/@progress/sitefinity-nextjs-sdk)

* src/middleware.ts -> Standard next.js middleware file. The default implementation contains the [proxy logic](./docs/CI-CD.md#proxy-logic). The file can be further modified according to the needs of the application.

* src/index.css -> Default styles for the widgets based on bootstrap.

* src/app/widget-registry.ts -> Contains the widget registrations. Use this file to register your own custom widgets. See [**Widget development**](./docs/Widgets.md) for new widgets.

* src/app/[...slug]/page.tsx -> This page file handles the rendering of all of the pages inside the CMS.

* src/app/render/page.tsx -> This page file is used for single component rendering during edit or rendering of personalized widgets.

* src/app/api/template-interceptor* -> Api route related to the proxy logic. The purpose of this route is to intercept the page templates response and inject a custom page template that will serve as a base for all of the future templates.

## Custom api routes
When using the RestClient in custom API routes be sure to initialize it first

E.g for route/api/navigation

``` React

export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import { RestClient } from '@progress/sitefinity-nextjs-sdk/rest-sdk';
import { ServiceMetadata } from '@progress/sitefinity-nextjs-sdk/rest-sdk';
import { headers } from 'next/headers';

export async function GET(request: NextRequest, { params }: { params: { } }) {
    // passing the params sfaction, sf_site, sf_culture in edit mode
    // these params can be extracted from the window object when page is beeing rendered in edit
    const isEdit = request.nextUrl.searchParams.get("sfaction") === 'edit';
    const siteId = request.nextUrl.searchParams.get("sf_site");
    const culture = request.nextUrl.searchParams.get("sf_culture");

    // The following parameters are used to initialize the rest sdk
    // with some additional information but they are optional

    // cache the response for 60 seconds
    const additionalFetchData = { next: { revalidate: 60 } };
    const host = headers().get('host') || '';
    await initServerSideRestSdk({
        additionalFetchData: additionalFetchData,
        host: host,
        queryParams: {
            sf_culture: culture,
            sf_site: isEdit ? siteId : ''
        }
    });

    const getAllArgs: any = {
        selectionModeString: '',
        levelsToInclude: 3,
        showParentPage: false,
        selectedPages: undefined,
    };

    const items = await RestClient.getNavigation(getAllArgs);

    return NextResponse.json(items);
}


```

## SDK cache configuration

You can configure the default cache type or the revalidation duration in the environment settings file (e.g., *env.development*). If these properties are not specified during the REST SDK initialization or passed with GET requests, the cache settings will fallback to the configuration provided in the environment settings, if available.

In the configuration, you can specify **SF_SDK_CACHE** and **SF_SDK_CACHE_REVALIDATE**.

1. **SF_SDK_CACHE_REVALIDATE**: This property sets the cache lifetime of a resource in seconds. The possible values are:
- **false**: Cache the resource indefinitely. This is semantically equivalent to revalidate: Infinity. Note that the HTTP cache may evict older resources over time.
- **0**: Prevent the resource from being cached.
- **number** (in seconds): Specify that the resource should have a cache lifetime of at most *number* seconds.
2. **SF_SDK_CACHE**: This property configures how the request interacts with the Next.js data cache. For more details, refer to the [Next.js documentation on data caching](https://nextjs.org/docs/app/building-your-application/caching#data-cache). The possible values are:
- **no-store**: Next.js fetches the resource from the remote server on every request without checking the cache, and it does not update the cache with the downloaded resource. The no-cache option behaves the same way as no-store.
- **force-cache**: Next.js looks for a matching request in its Data Cache. If a fresh match is found, it is returned from the cache. If no match or a stale match is found, Next.js fetches the resource from the remote server and updates the cache with the downloaded resource.

For more information, you can check the official documentation or resources related to [Next.js and caching](https://nextjs.org/docs/app/api-reference/functions/fetch).

## Fetching custom related fields with layout

If you wish to limit your requests and fetch the custom related fields of the page being rendered in a single request, you can request them in the root page file.

``` JSX

export default async function Page({ params, searchParams }: any) {
    initRendering(widgetRegistry, WidgetExecutionError);
    return RenderPage({ params, searchParams, relatedFields: ['Image'] });
}

```

And afterwards it can be acquired from the context of the widget:

``` JSX

export async function ContentBlock(props: WidgetContext<ContentBlockEntity>) {

    const image = props.requestContext.layout.Fields['Image'];
    ...

```

## Legacy MVC & Webforms pages handling

In order for the NextJs renderer to handle legacy MVC and WebForms pages, their urls have to be explicitly specified in one of 2 places:

- In `middleware.ts` file there is a variable called `whitelistedPaths` which is an array of strings. The urls of the pages can be placed as separate strings:
```tsx
const whitelistedPaths: string[] = ['/legacypageurlone', '/legacypageurltwo'];
```
- In `env.development` file by modifying the environmental variable like so: `SF_WHITELISTED_PATHS="/legacypageurlone,/legacypageurltwo"`.  More information about this configuration file can be found [here](./docs/CI-CD.md#environment-variables-legend).

### Legacy MVC & Webforms home page navigation

If the home page of the site is legacy (MVC/Web forms) navigation to it can be proxied and not rendered in one of 2 ways:

 - Navigating directly to the url: _'www.siteurl/homepage'_. This will require the home page to be listed in the `whitelistedPaths` like mentioned above
 - Navigating directly to the url: _'www.siteurl/'_. This will require setting `SF_IS_HOME_PAGE_LEGACY="true"` in the `env.development` file.



## CSP Headers

The default CSP headers are registered in the **next.config.js file**

## Getting started

To quickly set-up a dev environment, look at the docs in [**CI & CD**](./docs/CI-CD.md).

To learn more about widget development, look at [**Widget development**](./docs/Widgets.md)
