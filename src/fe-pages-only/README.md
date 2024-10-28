# Front end pages only

This example demonstrates how to configure your app for production to work exclusively with front-end pages. The middleware should be simplified by removing any unnecessary logic, particularly any logic related to backend pages. To do this, remove the backend middleware check from the [middleware.ts](./src/middleware.ts) file, as shown below:
``` typescript
const resultBackend = await middlewareBackend(request);
if (resultBackend instanceof NextResponse || resultBackend instanceof Response) {
    return resultBackend;
}
```

You can still browse all front-end pages and utilize their functionality. However, the backend of the Sitefinity app will not be accessible.

## Project setup
To setup the project follow the instructions [here](./../../README.md#project-setup).
