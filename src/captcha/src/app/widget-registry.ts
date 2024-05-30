import { WidgetRegistry, initRegistry, defaultWidgetRegistry } from '@progress/sitefinity-nextjs-sdk';
import { Captcha2 } from './widgets/captcha-2/captcha-2';
import { Captcha3 } from './widgets/captcha-3/captcha-3';
import { Captcha2FieldEntity } from './widgets/captcha-2/captcha-2-field.entity';
import { Captcha3FieldEntity } from './widgets/captcha-3/captcha-3-field.entity';

const customWidgetRegistry: WidgetRegistry = {
    widgets: {
        'Captcha2': {
            entity: Captcha2FieldEntity,
            componentType: Captcha2,
            editorMetadata: {
                Title: 'CAPTCHA 2',
                Toolbox: 'Forms',
                Section: 'Other',
                HideEmptyVisual: true,
                InitialProperties: {
                    SfFieldType: 'Captcha'
                }
            },
            ssr: true
        },
        'Captcha3': {
            entity: Captcha3FieldEntity,
            componentType: Captcha3,
            editorMetadata: {
                Title: 'CAPTCHA 3',
                Toolbox: 'Forms',
                Section: 'Other',
                HideEmptyVisual: true,
                InitialProperties: {
                    SfFieldType: 'Captcha'
                }
            },
            ssr: true
        }
    }
};

Object.keys(defaultWidgetRegistry.widgets).forEach((key) => {
    customWidgetRegistry.widgets[key] = defaultWidgetRegistry.widgets[key];
});

export const widgetRegistry: WidgetRegistry = initRegistry(customWidgetRegistry);
