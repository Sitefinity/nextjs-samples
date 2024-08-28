import { DefaultValue, DisplayName, ViewSelector, WidgetEntity } from '@progress/sitefinity-widget-designers-sdk';

@WidgetEntity('SitefinityData', 'Sitefinity data')
export class SitefinityDataEntity {
    @DisplayName('Show summary')
    @DefaultValue(true)
    ShowSummary?: boolean;

    @DisplayName('Items count')
    @DefaultValue(5)
    ItemsCount?: number;

    @DisplayName('Widget template')
    @DefaultValue('Default')
    @ViewSelector([{Value: 'Default'}])
    SfViewName?: string;
}
