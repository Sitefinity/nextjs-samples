import { WidgetRegistry, initRegistry, defaultWidgetRegistry } from '@progress/sitefinity-nextjs-sdk';
import { CarTypeFormWidget } from './widgets/cartype/cartype-form-widget';
import { CarConfiguratorSectionEntity } from './widgets/car-configurator-section/car-configurator-section.entity';
import CarConfiguratorSection from './widgets/car-configurator-section/car-configurator-section';
import { CarTypeEntity } from './widgets/cartype/cartype.entity';
import { ColorEntity } from './widgets/color/color.entity';
import { ColorFormWidget } from './widgets/color/color-form-widget';
import { EngineEntity } from './widgets/engine/engine.entity';
import { EngineFormWidget } from './widgets/engine/engine-form-widget';

const customWidgetRegistry: WidgetRegistry = {
    widgets: {
        'CarConfigurationSection': {
            entity: CarConfiguratorSectionEntity,
            componentType: CarConfiguratorSection,
            editorMetadata: {
                Title: 'CarConfiguratorSection',
                Toolbox: 'Forms',
                Category: 'Layout',
                IsEmptyEntity: true,
                InitialProperties: {
                    SfFieldType: 'FormSection'
                }
            },
            ssr: false
        },
        'CarType': {
            entity: CarTypeEntity,
            componentType: CarTypeFormWidget,
            editorMetadata: {
                Title: 'CarType',
                Toolbox: 'Forms',
                Category: 'Content',
                IsEmptyEntity: true,
                InitialProperties: {
                    SfFieldType: 'ShortText'
                }
            },
            ssr: false
        },
        'Color': {
            entity: ColorEntity,
            componentType: ColorFormWidget,
            editorMetadata: {
                Title: 'Color',
                Toolbox: 'Forms',
                Category: 'Content',
                IsEmptyEntity: true,
                InitialProperties: {
                    SfFieldType: 'ShortText'
                }
            },
            ssr: false
        },
        'Engine': {
            entity: EngineEntity,
            componentType: EngineFormWidget,
            editorMetadata: {
                Title: 'Engine',
                Toolbox: 'Forms',
                Category: 'Content',
                IsEmptyEntity: true,
                InitialProperties: {
                    SfFieldType: 'ShortText'
                }
            },
            ssr: false
        }
    }
};

// remove other widgets except the form for simplicity
customWidgetRegistry.widgets = {
    'SitefinityForm': defaultWidgetRegistry.widgets['SitefinityForm'],
    ...customWidgetRegistry.widgets
};

export const widgetRegistry: WidgetRegistry = initRegistry(customWidgetRegistry);
