import { WidgetRegistry, initRegistry, defaultWidgetRegistry } from '@progress/sitefinity-nextjs-sdk';

const customWidgetRegistry: WidgetRegistry = {
    widgets: {
        // 'HelloWorld': {
        //     componentType: HelloWorld, // registration of the widget
        //     entity: HelloWorldEntity, // registration of the designer
        //     ssr: true, // whether this is a server rendered or client rendered component
        //     editorMetadata: {
        //         Title: 'Hello World'
        //     }
        // }
    }
};

customWidgetRegistry.widgets = {
    ...defaultWidgetRegistry.widgets,
    ...customWidgetRegistry.widgets
};

export const widgetRegistry: WidgetRegistry = initRegistry(customWidgetRegistry);
