import { ContentSection, DataType, DisplayName, WidgetEntity } from '@progress/sitefinity-widget-designers-sdk';

@WidgetEntity('WidgetView', 'Widget view')
export class WidgetViewEntity {
    @ContentSection('Display settings')
    @DisplayName('Widget view')
    @DataType('viewSelector')
    SfViewName: string = 'Default';
}
