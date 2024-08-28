# Content-Security-Policy (CSP) HTTP Response Header

This security policy applies exclusively to Next.js pages.

The Sitefinity Next.js Renderer implements a trusted sources security policy out-of-the-box, which defines the value of the Content-Security-Policy (CSP) HTTP response header. This header controls the resources that the user agent can load, specifying the server origins and script endpoints for page resources.

The CSP response header is a powerful tool that protects against cross-site attacks, such as clickjacking and Cross-Site Scripting (XSS). It helps safeguard your site by allowing only website services from whitelisted sources.

The default CSP headers are registered in the **next.config.js** file. You can configure the Content-Security-Policy HTTP header by extendig the *cspHeader* in **next.config.js**.

Misconfiguration may block some resources from loading. If the header is used with the default, preconfigured value, it will block nearly all external resources, which may prevent pages from using external CSS, fonts, images, scripts, and other assets. If your site relies on external resources, you should whitelist all trusted domains in the header configuration for each respective resource type.
