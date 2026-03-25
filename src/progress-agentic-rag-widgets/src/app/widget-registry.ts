import { WidgetRegistry, initRegistry, defaultWidgetRegistry } from '@progress/sitefinity-nextjs-sdk';
import { PARAGAssistantEntity } from './widgets/assistant/parag-assistant.entity';
import { PARAGAssistant } from './widgets/assistant/parag-assistant';
import { PARAGAskBoxEntity } from './widgets/parag-ask-box/parag-ask-box.entity';
import { PARAGAskBox } from './widgets/parag-ask-box/parag-ask-box';
import { PARAGAnswerEntity } from './widgets/parag-answer/parag-answer.entity';
import { PARAGAnswer } from './widgets/parag-answer/parag-answer';
import { PARAGResultsEntity } from './widgets/parag-results/parag-results.entity';
import { PARAGResults } from './widgets/parag-results/parag-results';

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
        },
        'PARAGAskBox': {
            componentType: PARAGAskBox,
            entity: PARAGAskBoxEntity,
            ssr: true,
            editorMetadata: {
                Title: 'PARAG ask box',
                Category: 'Content',
                Section: 'AI search',
                EmptyIconText: 'Set where to search',
                EmptyIcon: 'search',
                HasQuickEditOperation: true,
                IconName: 'ai-search-sparkle'
            }
        },
        'PARAGAnswer': {
            componentType: PARAGAnswer,
            entity: PARAGAnswerEntity,
            ssr: true,
            editorMetadata: {
                Title: 'PARAG answer',
                Category: 'Content',
                Section: 'AI search',
                HasQuickEditOperation: true,
                IconName: 'ai-search-sparkle'
            }
        },
        'PARAGResults': {
            componentType: PARAGResults,
            entity: PARAGResultsEntity,
            ssr: true,
            editorMetadata: {
                Title: 'PARAG results',
                Category: 'Content',
                Section: 'AI search',
                HasQuickEditOperation: true,
                IconName: 'ai-search-sparkle'
            }
        }
    }
};

Object.keys(defaultWidgetRegistry.widgets).forEach((key) => {
    customWidgetRegistry.widgets[key] = defaultWidgetRegistry.widgets[key];
});

export const widgetRegistry: WidgetRegistry = initRegistry(customWidgetRegistry);
