import { WidgetRegistry, initRegistry, defaultWidgetRegistry } from '@progress/sitefinity-nextjs-sdk';
import { ExtendedContentBlockEntity } from './widgets/content-block/extended-content-block.entity';
import { ExtendedContentBlock } from './widgets/content-block/extended-content-block';

const contentBlockRegistration = defaultWidgetRegistry.widgets['SitefinityContentBlock'];
contentBlockRegistration.entity = ExtendedContentBlockEntity; // registration of the widget designer
contentBlockRegistration.componentType = ExtendedContentBlock; // registration of the widget component

export const widgetRegistry: WidgetRegistry = initRegistry(defaultWidgetRegistry);
