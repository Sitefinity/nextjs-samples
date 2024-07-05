import { WidgetRegistry, initRegistry, defaultWidgetRegistry } from '@progress/sitefinity-nextjs-sdk';
import { LocalizedHelloWorld } from './widgets/localization/localized-hello-world';
import { LocalizedHelloWorldEntity } from './widgets/localization/localized-hello-world.entity';
import { LocalizedHelloWorldCSR } from './widgets/localization/localized-hello-world-CSR';
import { LocalizedHelloWorldEntityCSR } from './widgets/localization/localized-hello-world-CSR.entity';

const customWidgetRegistry: WidgetRegistry = {
    widgets: {
        'LocalizedHelloWorld': {
            componentType: LocalizedHelloWorld, // registration of the widget
            entity: LocalizedHelloWorldEntity, // registration of the designer
            ssr: true, // whether this is a server rendered or client rendered component
            editorMetadata: {
                Title: 'Localized hello world widget'
            }
        },
        'LocalizedHelloWorldCSR': {
            componentType: LocalizedHelloWorldCSR,
            entity: LocalizedHelloWorldEntityCSR,
            ssr: false,
            editorMetadata: {
                Title: 'Localized hello world widget - CSR'
            }
        }
    }
};

Object.keys(defaultWidgetRegistry.widgets).forEach((key) => {
    customWidgetRegistry.widgets[key] = defaultWidgetRegistry.widgets[key];
});

export const widgetRegistry: WidgetRegistry = initRegistry(customWidgetRegistry);
