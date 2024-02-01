# Sitefinity Renderer for Next.js

## Getting started

To quickly set-up a dev environment, look at the docs in [**CI & CD**](./docs/CI-CD.md).

To learn more about widget development, look at [**Widget development**](./docs/Widgets.md)

## Dev Quickstart

Refer to the [**CI & CD section**](./docs/CI-CD.md#running-in-local-development-mode)

## Project setup

The NextJS starter app can be installed via the following command

``` bash
npx create-next-app --example "https://github.com/sitefinity/nextjs-starter"
```

## File structure

The starter template repository contains a set of files that are built specifically for the integration with the Sitefinity CMS. Some of the files are explained bellow

* next.config.js -> The [standard config file for nextjs](https://nextjs.org/docs/app/api-reference/next-config-js). This file has been modified to sooth the needs of the integration with the CMS. The file can be further modified according to the needs of the application.

* public/assets -> Contains resources such as bootstrap and the default thumbnail for page templates selection in the administration.

* package.json -> Standard package.json file with dependencies for **@progress/sitefinity-widget-designers-sdk** and **@progress/sitefinity-nextjs-sdk**

* src/middleware.ts -> Standard next.js middleware file. The default implementation contains the [proxy logic](./docs/CI-CD.md#proxy-logic). The file can be further modified according to the needs of the application.

* src/index.css -> Default styles for the widgets based on bootstrap.

* src/app/widget-registry.ts -> Contains the widget registrations. Use this file to register your own custom widgets. See [**Widget development**](./docs/Widgets.md) for new widgets.

* src/app/[...slug]/page.tsx -> This page file handles the rendering of all of the pages inside the CMS.

* src/app/render/page.tsx -> This page file is used for single component rendering during edit or rendering of personalized widgets.

* src/app/api/template-interceptor* -> Api route related to the proxy logic. The purpose of this route is to intercept the page templates response and inject a custom page template that will serve as a base for all of the future templates.

## Home page

The default behavior for the home page is to redirect the root '/' path to '/home'. This can be configured in [next.config.js file](./next.config.js)

## CSP Headers

The default CSP headers are registered in the [next.config.js file](./next.config.js)
