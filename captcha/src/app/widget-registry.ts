import { WidgetRegistry, initRegistry, defaultWidgetRegistry } from '@progress/sitefinity-nextjs-sdk';
import { Captcha2 } from './widgets/captcha-2/captcha-2';
import { Captcha3 } from './widgets/captcha-3/captcha-3';

const customWidgetRegistry: WidgetRegistry = {
    widgets: {
        'Captcha2': {
            componentType: Captcha2,
            editorMetadata: {
                Title: 'CAPTCHA 2',
                Toolbox: 'Forms',
                Section: 'Other',
                InitialProperties: {
                    SfFieldType: 'Captcha'
                }
            },
            ssr: true
        },
        'Captcha3': {
            componentType: Captcha3,
            editorMetadata: {
                Title: 'CAPTCHA 3',
                Toolbox: 'Forms',
                Section: 'Other',
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
