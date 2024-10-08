CI & CD
======================================================
# Setup the Next.js renderer

## Running in local development mode

Running in dev mode **does not require installing additional software and works on any nodejs supported OS**. Follow these steps:

1. Run ```npm i``` command to install all necessary packages
2. Go to [.env.development](../.env.development) file and set the **SF_CMS_URL** variable to point to the URL of the CMS.
3. \[Optional\] Create an access key for the user and set it to the **SF_ACCESS_KEY** environment variable. For more information, see [Creating access keys article](https://www.progress.com/documentation/sitefinity-cms/generate-access-key)
4. Run ```npm run dev``` command to run the application. By default it runs on **https://localhost:5001**

>**NOTE**: The application runs under SSL by default and installs a default ssl certificate. If you wish to remove it, change the **dev** command in the [package.json file](../package.json)

### Proxy logic

To have seamless experience when using the standalone Renderer application together with Sitefinity CMS, the Renderer is also working as a proxy and forwards every request it cannot handle to Sitefinity CMS. This way, the user does not have to switch between the two applications. This is done through the **SF_CMS_URL** environment variable. Setting this variable will allow proxying any requests unhandled by the next.js renderer to the CMS.

You host the Renderer at your public domain and your users use only this domain, without considering whether the Renderer or Sitefinity CMS will handle their request.

>**NOTE**: The proxy logic facilitates the migration of Sitefinity CMS pages that are created with ASP.NET MVC to the new Next.js pages, created with the Renderer application.

### Environment variables legend

* (Required)**SF_CMS_URL** -> The URL of the CMS, where to proxy all of the requests that are not pages and to which all of the API call will be made.
* (Required)**'SF_LOCAL_VALIDATION_KEY'** -> The secret key to work with Sitefinity Cloud. **Required only when working with Sitefinity cloud**. Refer to this [doc](https://www.progress.com/documentation/sitefinity-cms/cloud/code-deployment)
* (Optional)**'NEXT_PUBLIC_SF_CMS_URL'** -> The URL of the CMS for client-side calls, to which all of the API call will be made. Defaults to **'/'**.
* (Optional)**'SF_PROXY_ORIGINAL_HOST'** -> Environment variable that controls the host header sent to the CMS. Useful for multisite testing locally.
* (Optional)**'SF_HOST_HEADER_NAME'** -> Environment variable that controls the host header sent to the CMS. Useful for cloud hosting when the original host is sent via a custom header value.
* (Optional)**'SF_WHITELISTED_PATHS'** -> Comma separated urls to pages made with the legacy (MVC/Web forms) frameworks so that the requests can be proxied to Sitefinity for them. Defaults to **''**.
* (Optional)**'SF_IS_HOME_PAGE_LEGACY'** -> A flag indicating that the home page of the site is created with the legacy frameworks (MVC/Web forms) and navigation to _'www.siteurl/'_ will proxy the request to Sitefinity. Defaults to **'false'**.

# Deploy the Next.js renderer

There are several approaches to deploy the application. The deployment is the same as for any Next.js application and the [official documentation](https://nextjs.org/docs/pages/building-your-application/deploying) applies to this application as well.

## Hosting configurations

### Overview
The Next.js renderer is a standalone application, which you can host separately from Sitefinity CMS.

The following scenarios for hosting the renderer application are supported:
- Local - Both the Renderer and Sitefinity CMS applications run on the local user machine, but are hosted under different ports –  for example, localhost:1234 for Sitefinity CMS and localhost:5001 for the Renderer application.
- Cloud - Both applications are be hosted in the cloud.
- Mixed (Development) - The Renderer application is hosted locally and points to a remote Sitefinity CMS instance – for example, hosted on Azure App Services or on a remote IIS instance. This way, the developer is enabled to work with the latest database from the live, staging, or development environment, and preview the changes.

>**NOTE**: For the cloud scenario, you must add all the domains of the live Renderer website to your Sitefinity license.

>**RECOMMENDATION**: We strongly recommend not hooking a local Renderer to a live Sitefinity CMS instance. Because any changes to the live environment will not be applied to the local development environment, thus, breaking the Continuous delivery process and causing malfunction to any live Renderer.

### Host Sitefinity CMS in Sitefinity cloud
Additional project setup steps for Sitefinity CMS hosted in Sitefinity cloud:

1. In Sitefinity Cloud, navigate to your dedicated Key Vault instance. For more information, see [Azure Key Vault](https://www.progress.com/documentation/sitefinity-cms/cloud/use-key-vault).
Under **Secrets**, find the **LocalValidationKey** and copy the value of the secret.
2. Set the **SF_LOCAL_VALIDATION_KEY** environment variable with the value of the secret copied in the previous step.

### Host Sitefinity CMS in Azure
If your project is hosted on Azure App Services, you need to make some specific settings, so that your Sitefinity CMS can communicate with the Renderer application:

1. Set up a 64-bit process in the App Service platform configuration. To do this, perform the following:
    1. In the Azure portal, click your service.
    2. Under **Settings**, click **Configuration**.
    3. Click **General settings**.
    4. In **Platform** dropdown box, select 64 Bit.
    5. Restart the app service.
2. Rewrite the **X-Original-Host** header sent from the Renderer to Host header. To do this, install an additional extension from the Kudu console in the following way:
    1. In the Azure portal, click your service.
    2. In the sidebar, under **Development tools** section, click **Advanced Tools** » **Go**.
    3. In the Kudu console, expand the **Site extensions**.
    4. Search for the **Application Gateway Host Rewrite Module** and follow the installation instructions.
    5. Restart the Kudu service.

### Host Sitefinity CMS on IIS
If your project is hosted on a local IIS, you need to make some specific settings, so that your Sitefinity CMS can communicate with the Renderer application:

1. Host Sitefinity CMS by performing procedure [Run projects on IIS](https://www.progress.com/documentation/sitefinity-cms/run-projects-on-iis).
2. Download the NuGet package [Progress.Sitefinity.Cloud.AppGatewayHostRewriteModule](https://www.nuget.org/packages/Progress.Sitefinity.Cloud.AppGatewayHostRewriteModule/).
3. Change the file extension from .nupkg to .zip and extract the files.
4. In the extracted folder, navigate to the **Content** folder.
5. Copy the HostRewriteModule.dll and paste in a dedicated folder.

>**NOTE**: IIS's **NETWORK SERVICE** must have permissions to access the folder. The file must remain in this folder for as long as the extension is used. Deleting the file or its folder can cause issues.

6. Open Internet Information Services (IIS) Manager.
7. At the top, select your server and click **Modules**.
8. Click **Configure Native Modules** » **Register**.
9. Set the name to **AppGatewayHostRewriteModule**
10. In **Path**, navigate to the **HostRewriteModule.dll**, select it, and click OK.
11. Ensure the checkbox next to **AppGatewayHostRewriteModule** is selected and click OK.

### Host Next.js Renderer on IIS (**using HttpPlatformHandler**)
If you wish to host your Next.JS Renderer under IIS, you need to setup IIS to act as a proxy to your original application:

1. Install HttpPlatformHandler v1.2
2. Add the following web.config file in the root of the web app

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

3. Be sure to replace the paths to **node.exe** and **next** if they are different
4. Set the **SF_PROXY_ORIGINAL_HOST** to the actual domain of the Next.js Renderer app that will be used for hosting in IIS.

### Host Next.js Renderer on docker
When the renderer is hosted on docker the resolved host from the http request will be something in the form of 'localhost' or 'localhost:port'. The end result here would be that for every 21st request to a page you would recieve the license page since the domain of 'localhost' is not something registered in the licsense file of the CMS. To adjust for this, please make sure to pass to the **X-ORIGINAL-HOST** header, the proper value with the actual domain.

If using a single site only you can pass the value through the **SF_PROXY_ORIGINAL_HOST** environment variable.
