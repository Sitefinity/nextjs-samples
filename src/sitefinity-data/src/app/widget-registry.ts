import { WidgetRegistry, initRegistry, defaultWidgetRegistry } from '@progress/sitefinity-nextjs-sdk';
import { SitefinityData } from './widgets/sitefinity-data/sitefinity-data';
import { SitefinityDataEntity } from './widgets/sitefinity-data/sitefinity-data.entity';

const customWidgetRegistry: WidgetRegistry = {
    widgets: {
        'SitefinityData': {
            componentType: SitefinityData, // registration of the widget
            entity: SitefinityDataEntity, // registration of the designer
            ssr: true, // whether this is a server rendered or client rendered component
            editorMetadata: {
                Title: 'Sitefinity data'
            }
        }
    }
};

Object.keys(defaultWidgetRegistry.widgets).forEach((key) => {
    customWidgetRegistry.widgets[key] = defaultWidgetRegistry.widgets[key];
});

export const widgetRegistry: WidgetRegistry = initRegistry(customWidgetRegistry);
