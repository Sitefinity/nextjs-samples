import { WidgetRegistry, initRegistry, defaultWidgetRegistry } from '@progress/sitefinity-nextjs-sdk';
import { StaticSection } from './widgets/custom-section/static-section';
import { StaticSectionEntity } from './widgets/custom-section/static-section.entity';
import { ContainerView } from './widgets/custom-section/container.view';
import { ContainerFluidView } from './widgets/custom-section/container-fluid.view';
import { TwoMixedView } from './widgets/custom-section/twoMixed.view';
import { ThreeAutoLayoutView } from './widgets/custom-section/threeAutoLayout.view';
import { Child } from './widgets/child/child';

const customWidgetRegistry: WidgetRegistry = {
    widgets: {
        'StaticSection': {
            componentType: StaticSection, // registration of the widget
            entity: StaticSectionEntity, // registration of the designer
            editorMetadata: {
                Title: 'Static section',
                Category: 'Layout',
                Section: 'Empty section',
                IconName: 'section'
            },
            views: { // registration of the views
                Container: ContainerView,
                ContainerFluid: ContainerFluidView,
                TwoMixed: TwoMixedView,
                ThreeAutoLayout: ThreeAutoLayoutView
            },
            ssr: true // whether this is a server rendered or client rendered component
        },
        'Child': {
            componentType: Child, // registration of the widget
            designerMetadata: {
                'Name': 'SitefinityChild',
                'PropertyMetadata': []
            },
            editorMetadata: {
                Title: 'Child',
                Category: 'Content',
                Section: 'Basic',
                HideEmptyVisual: true
            },
            ssr: true // whether this is a server rendered or client rendered component
        }
    }
};

customWidgetRegistry.widgets = {
    ...defaultWidgetRegistry.widgets,
    ...customWidgetRegistry.widgets
};

export const widgetRegistry: WidgetRegistry = initRegistry(customWidgetRegistry);
