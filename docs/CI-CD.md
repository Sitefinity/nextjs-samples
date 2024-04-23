CI & CD
======================================================

# Running in local development mode

Running in dev mode **does not require installing additional software and works on any nodejs supported OS**. Follow these steps:

## Running under https
The sample runs under SSL by default and installs a default ssl certificate. If you wish to remove it, change the command in [package.json](../package.json)

## Proxy logic

To have seamless experience when using the standalone Renderer application together with Sitefinity CMS, the Renderer is also working as a proxy and forwards every request it cannot handle to Sitefinity CMS. This way, the user does not have to switch between the two applications. This is done through the **'SF_CMS_URL'** environment variable. Setting this variable will allow proxying any requests unhandled by the next.js renderer to the CMS.

You host the Renderer at your public domain and your users use only this domain, without considering whether the Renderer or Sitefinity CMS will handle their request.

**NOTE The proxy logic facilitates the migration of Sitefinity CMS pages that are created with ASP.NET MVC to the new Next.js pages, created with the Renderer application.**

## Environment variables legend

### Development (.env.development)

* (Required)**'SF_CMS_URL'** -> The URL of the CMS, where to proxy all of the requests that are not pages and to which all of the API call will be made. **Required only when SF_CMS_URL is not present**
* (Required)**'SF_CLOUD_KEY'** -> The secret key to work with Sitefinity Cloud. **Required only when working with Sitefinity cloud**. Refer to this [doc](https://www.progress.com/documentation/sitefinity-cms/cloud/code-deployment)
* (Optional)**'NEXT_PUBLIC_SF_CMS_URL'** -> The URL of the CMS for client-side calls, to which all of the API call will be made. Defaults to **'/'**.

# Deploying to production

There are several approaches to deploy the application. The deployment is the same as for any next.js application and the official [next.js](https://nextjs.org/docs/pages/building-your-application/deploying) applies to this application as well.
The specifics are outlined bellow:
