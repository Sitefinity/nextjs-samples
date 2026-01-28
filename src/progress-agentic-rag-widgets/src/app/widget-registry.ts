import { WidgetRegistry, initRegistry, defaultWidgetRegistry } from '@progress/sitefinity-nextjs-sdk';
import { PARAGAssistantEntity } from './widgets/assistant/parag-assistant.entity';
import { PARAGAssistant } from './widgets/assistant/parag-assistant';

const customWidgetRegistry: WidgetRegistry = {
    widgets: {
        'PARAGAssistant': {
            componentType: PARAGAssistant, // registration of the widget
            entity: PARAGAssistantEntity, // registration of the designer
            ssr: true, // whether this is a server rendered or client rendered component
            editorMetadata: {
                Title: 'PARAG assistant',
                Category: 'Content',
                Section: 'Marketing',
                EmptyIconText: 'Select an AI assistant',
                EmptyIcon: 'pencil',
                IconName: 'chat'
            }
        }
    }
};

Object.keys(defaultWidgetRegistry.widgets).forEach((key) => {
    customWidgetRegistry.widgets[key] = defaultWidgetRegistry.widgets[key];
});

export const widgetRegistry: WidgetRegistry = initRegistry(customWidgetRegistry);
