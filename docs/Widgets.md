Widget development
======================================================

## How does it work

The WYSIWYG page editor of Sitefinity works with reusable components called widgets. Leveraging the power of the editor, developers can build custom SPA frontend for their users. This sample demonstrates how to integrate a custom front-end framework (such as React) in the page editor.

The whole renderer framework for the react renderer is already built (including integration with the WYSIWYG editor), so all there is to do is just write 'React widgets'. Developing widgets for the NextJs Renderer is just like developing plain React Components. There are some integration points which we will go through. For this purpose find the bellow Hello World tutorial.

## Default widgets

### Registries

The Sitefinity NextJS SDK provides a registry of OOB widgets with 2 variations currently - **defaultWidgetRegistry** and **legacyWidgetRegistry**. With _Sitefinity 15.1_ we have introduced a redesign of the widget selector in the WYSIWYG page editor, which differs visually completely and rearranges the widgets a different manner in terms of categories. Depending on your Sitefinity version, we suggest to use different default registries:

#### Before Sitefinity 15.1:
```ts
import { initRegistry, legacyWidgetRegistry } from '@progress/sitefinity-nextjs-sdk';

const customWidgetRegistry: WidgetRegistry = {
    widgets: {
        // ...
    }
};

customWidgetRegistry.widgets = {
    ...legacyWidgetRegistry.widgets,
    ...customWidgetRegistry.widgets
};

export const widgetRegistry: WidgetRegistry = initRegistry(customWidgetRegistry);

```

#### After Sitefinity 15.1:
```ts
import { initRegistry, defaultWidgetRegistry } from '@progress/sitefinity-nextjs-sdk';

const customWidgetRegistry: WidgetRegistry = {
    widgets: {
        // ...
    }
};

customWidgetRegistry.widgets = {
    ...defaultWidgetRegistry.widgets,
    ...customWidgetRegistry.widgets
};

export const widgetRegistry: WidgetRegistry = initRegistry(customWidgetRegistry);
```

### Form widgets

The OOB form widgets come with mixed SSR and CSR rendering. We provide a full CSR variation of these widgets (_CSRFormComponents_, _SSRFormComponents_, _LegacyCSRFormComponents_, _LegacySSRFormComponents_). To replace the SSR forms with full CSR forms, you need to override them in your registry:

```ts
import { WidgetRegistry, initRegistry, defaultWidgetRegistry, CSRFormComponents  } from '@progress/sitefinity-nextjs-sdk';

const customWidgetRegistry: WidgetRegistry = {
    widgets: {
        // ...
    }
};

customWidgetRegistry.widgets = {
    ...defaultWidgetRegistry.widgets,
    ...customWidgetRegistry.widgets,
    ...CSRFormComponents
};

export const widgetRegistry: WidgetRegistry = initRegistry(customWidgetRegistry);

```

## Hello World widget

### Building the component

In order to build our own custom widget, we need to first create a folder that will hold our files. We will name our widget - ‘Hello World’ and it will be placed in the ‘hello-world' folder(under src/app/components). We then create a file in that folder called ‘hello-world.tsx’ that will host our react component. It will have the following content:

``` typescript

import React from 'react';
import { WidgetContext, htmlAttributes } from '@progress/sitefinity-nextjs-sdk';
import { HelloWorldEntity } from './hello-world.entity';

export function HelloWorld(props: WidgetContext<HelloWorldEntity>) {

    // attributes are needed for the widget to be visible in edit mode
    const dataAttributes = htmlAttributes(props);
    return (
      <h1 {...dataAttributes}>{props.model.Properties.Content}</h1>
    );
}


```

### Building the designer

Second - we need to define the designer. This is done by creating a 'hello-world.entity.ts file' (the name does not matter) and it will hold the metadata that will be read from the widget designer in order to construct the designer.

``` typescript
import { WidgetEntity } from '@progress/sitefinity-widget-designers-sdk';

@WidgetEntity('HelloWorld', 'Hello world')
export class HelloWorldEntity {
    Content: string | null = null;
}

```

For more information about the full capabilities and more advanced configurations, please refer to the [@progress/sitefinity-widget-designers-sdk](https://www.npmjs.com/package/@progress/sitefinity-widget-designers-sdk) package documentation.


### Registration with the framework

Once we have the above two files ready, we need to register the component implementation and the designer metadata with the NextJs Renderer.

For the component we need to go to the file [render-widget-service](./src/app/widget-registry.ts) and to add a new entry to the map like so:

``` typescript
import { WidgetRegistry, initRegistry, defaultWidgetRegistry } from '@progress/sitefinity-nextjs-sdk';
import { HelloWorld } from './components/hello-world/hello-world';
import { HelloWorldEntity } from './components/hello-world/hello-world.entity';

const customWidgetRegistry: WidgetRegistry = {
    widgets: {
        'HelloWorld': {
            componentType: HelloWorld, // registration of the widget
            entity: HelloWorldEntity, // registration of the designer
            editorMetadata: {...} // metadata to be displayed in the WYSIWYG edotir - title, available operation, empty content visuals etc.
            ssr: true // whether this is a server rendered or client rendered component
        }
    }
};
```

### Other tooling

#### HTML sanitization

@progress/sitefinity-nextjs-sdk provides _SanitizerService.sanitizeHtml(html, config?)_ static method that uses server side and client side [DomPurify](https://www.npmjs.com/package/isomorphic-dompurify). The default configuration allows for some additional tags and attributes and could be overridden via _SanitizerService.configure(config)_ where the configuration object is a partial implementation of the DomPurify [configuration format](https://github.com/cure53/DOMPurify/blob/main/README.md#can-i-configure-dompurify).
