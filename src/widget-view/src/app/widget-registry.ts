import { WidgetRegistry, initRegistry, defaultWidgetRegistry } from '@progress/sitefinity-nextjs-sdk';
import { WidgetView } from './widgets/widget-view/widget-view';
import { WidgetViewEntity } from './widgets/widget-view/widget-view-entity';
import { CustomViewExample } from './widgets/widget-view/custom-views/custom-view-example';

const customWidgetRegistry: WidgetRegistry = {
    widgets: {
        'WidgetView': {
            componentType: WidgetView, // registration of the widget
            entity: WidgetViewEntity, // registration of the designer
            ssr: true, // whether this is a server rendered or client rendered component
            editorMetadata: {
                Title: 'Widget view'
            },
            views: {
                'CustomViewForWidgetView': {
                    Title: 'Custom view for widget view',
                    ViewFunction: CustomViewExample
                }
            }
        }
    }
};

customWidgetRegistry.widgets = {
    ...defaultWidgetRegistry.widgets,
    ...customWidgetRegistry.widgets
};

export const widgetRegistry: WidgetRegistry = initRegistry(customWidgetRegistry);
