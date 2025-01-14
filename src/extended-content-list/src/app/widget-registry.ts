import { WidgetRegistry, initRegistry, defaultWidgetRegistry, addWidgetViews } from '@progress/sitefinity-nextjs-sdk';
import { CardsListCustomView } from './widgets/content-list/cards-list-custom.view';
import { CustomDetailView } from './widgets/content-list/custom-detail.view';
import { ExtendedContentListEntity } from './widgets/content-list/extended-content-list.entity';

const contentListRegistration = defaultWidgetRegistry.widgets['SitefinityContentList'];
contentListRegistration.entity = ExtendedContentListEntity; // registration of the widget designer
addWidgetViews(defaultWidgetRegistry, 'SitefinityContentList', {'CardsListCustom': CardsListCustomView});
addWidgetViews(defaultWidgetRegistry, 'SitefinityContentList', {'Details.Custom': CustomDetailView});

export const widgetRegistry: WidgetRegistry = initRegistry(defaultWidgetRegistry);
