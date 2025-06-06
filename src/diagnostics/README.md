# SSR Diagnostics

By enabling SSR tracing on the Next.js server you can observe the rendering of the widgets and the sequence of requests, their count and duration and verify any performance hits that could occur when rendering your the pages.

We provide _@progress/sitefinity-nextjs-sdk/diagnostics/dev_ module with sample implementation for tracing widget performance utilizing the **Next.js exprimental implementation** and **OpenTelemetry**.

By default the module that is required in the nextjs-sdk is the _@progress/sitefinity-nextjs-sdk/diagnostics/empty_ which is an API mock with no dependencies that does not carry and side effects when deployed in production.

> [!WARNING]
> The Next.js instrumentation implementation is at experimental stage at the moment and both their and our API can be a subject to changes.

> [!WARNING]
> The OpenTelemetry implementation is currently only supported for SSR components and server code. For performance analytics on the Front end, please refer to the Next.JS usage of [useReportWebVitals](https://nextjs.org/docs/pages/building-your-application/optimizing/analytics).

## Enabling tracing in your development application

1. Install the needed OpenTelemetry npm packages to your local development setup:

```bash
npm i @opentelemetry/api @opentelemetry/exporter-trace-otlp-http @opentelemetry/resources @opentelemetry/sdk-node @opentelemetry/sdk-trace-node @opentelemetry/semantic-conventions --save-dev
```

2. Enable tracing for Next.js in the next.config.js and change the module resolution in the webpack config:
```js
module.exports = {
    // ...
    webpack: (config, options) => {
        config.resolve['alias']['@progress/sitefinity-nextjs-sdk/diagnostics/empty'] = '@progress/sitefinity-nextjs-sdk/diagnostics/dev';

        config.resolve['alias']['@widgetregistry'] = path.resolve(__dirname, 'src/app/widget-registry'); // <- this should be present by default in your project

        return config;
    },
    serverExternalPackages:[
        "@opentelemetry/sdk-node",
    ]
    // ...
}
```

3. Include the _intrumentation.ts_ and _instrumentation.node.ts_ to your project.

For more information, please refer to the [Nexj.js custom open telemetry configuration](https://nextjs.org/docs/pages/building-your-application/optimizing/open-telemetry#manual-opentelemetry-configuration)

## Consuming and reading the trace data

We suggest using the dev Docker setup provided by Next.js in the following repository: [OpenTelemetry Collector Demo](https://github.com/vercel/opentelemetry-collector-dev-setup).

Filtering the precise page requests can be achieved in Jaeger and Zipkin by the _http.route_, _http.target_, _next.route_ tags assigned to the traces by Next.js.


## SSR Widget tracing

Importing the _@progress/sitefinity-nextjs-sdk/diagnostics/empty_ package would make sure that your widget will work and not report data if you disable the tracing and remove the module alias in the webpack config.

```tsx
import { RestClient } from '@progress/sitefinity-nextjs-sdk/rest-sdk';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';

export async function CustomWidget(props: WidgetContext<CustomWidgetEntity>) {
    const {span, ctx} = Tracer.traceWidget(props, true);

    // ...

    const serverData = RestClient.getItems({
        type: //...,
        traceContext: ctx // <- passing this context to the RestClient request would associate the request to the current widget via the open telemetry context created by the Tracer.traceWidget, otherwise the request's span will be logged as a child of the page render root span
    });

    // ...

    return (
        <>
        {/* view implementation */}
        {Tracer.endSpan(span) /* <- make sure you close the span; this method returns null regardless of whether the diagnostics is enabled or not and would not affect the output of the widget */}
        </>
    );
}
```

## Other tracing

### Tracing server-to-server http requests



```ts
await RestClient.sendRequest({url, traceContext});

await RestClient.getItems({/*... getAllArgs*/, traceContext})
```

#### Obtaining trace context
You can obtain an optional trace Context in several ways. Not providing such context will log the request in the root of the Next.js route render span.

```ts
import { context } from '@opentelemetry/api';

const ctx = context.active();
```

```ts
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';

const {span, ctx} = Tracer.startSpan(key, startNewSubContextToUseLater?, currentContext?);
// the ctx will be either a new context for the created span or the context.active() depending on the second parameter
// ...

Tracer.endSpan(span);
```

```ts
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';

Tracer.startTrace(key, (span) => {
    // code to trace with its own current context
    Tracer.endSpan(span);
})
```

Furthermore, you can use any functionality that the [NodeSDK for Open Telemetry](https://opentelemetry.io/docs/languages/js/getting-started/nodejs/) provides.

