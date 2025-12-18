import { WidgetRegistry, initRegistry, defaultWidgetRegistry } from '@progress/sitefinity-nextjs-sdk';
import { Script } from './widgets/script/script';
import { ScriptEntity } from './widgets/script/script.entity';

const customWidgetRegistry: WidgetRegistry = {
    widgets: {
        'Script': {
            componentType: Script,
            entity: ScriptEntity,
            ssr: true, 
            editorMetadata: {
                Title: 'Script',
                Category: 'Content',
                Section: 'Basic',
                EmptyIconText: 'Set JavaScript',
                EmptyIconAction: 'Edit',
                IconName: 'code'
            }
        }
    }
};

customWidgetRegistry.widgets = {
    ...defaultWidgetRegistry.widgets,
    ...customWidgetRegistry.widgets
};

export const widgetRegistry: WidgetRegistry = initRegistry(customWidgetRegistry);
