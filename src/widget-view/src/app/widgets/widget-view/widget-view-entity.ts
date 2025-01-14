import { ContentSection, DisplayName, ViewSelector, WidgetEntity } from '@progress/sitefinity-widget-designers-sdk';

@WidgetEntity('WidgetView', 'Widget view')
export class WidgetViewEntity {
    @ContentSection('Display settings')
    @DisplayName('Widget view')
    @ViewSelector()
    SfViewName: string = 'Default';
}
