import { WidgetRegistry, initRegistry, defaultWidgetRegistry } from '@progress/sitefinity-nextjs-sdk';
import { AllProperties } from './widgets/all.properties';
import { AllPropertiesEntity } from './widgets/all-properties.entity';

const customWidgetRegistry: WidgetRegistry = {
    widgets: {
        'AllProperties': {
            componentType: AllProperties, // registration of the widget
            entity: AllPropertiesEntity, // registration of the designer
            ssr: true, // whether this is a server rendered or client rendered component
            editorMetadata: {
                Title: 'All properties'
            }
        }
    }
};

Object.keys(defaultWidgetRegistry.widgets).forEach((key) => {
    customWidgetRegistry.widgets[key] = defaultWidgetRegistry.widgets[key];
});

export const widgetRegistry: WidgetRegistry = initRegistry(customWidgetRegistry);
