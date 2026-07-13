# Front end pages only

This example demonstrates how to configure your app for production to work exclusively with front-end pages. The proxy should be simplified by removing any unnecessary logic, particularly any logic related to backend pages. To do this use the provided proxy file in this sample.

You can still browse all front-end pages and utilize their functionality. However, the backend of the Sitefinity app will not be accessible.

## Legacy MVC & Webforms pages handling

In order for the NextJs renderer to handle legacy MVC and WebForms pages, their urls have to be explicitly specified in one of 2 places:

- In `proxy.ts` file there is a variable called `whitelistedPaths` which is an array of strings. The urls of the pages can be placed as separate strings:
```tsx
const whitelistedPaths: string[] = ['/legacypageurlone', '/legacypageurltwo'];
```
- In `env.development` file by modifying the environmental variable like so: `SF_WHITELISTED_PATHS="/legacypageurlone,/legacypageurltwo"`. These should be comma separated urls and requests to those urls will be proxied to Sitefinity.

## Project setup
To setup the project follow the instructions [here](./../../README.md#project-setup).
