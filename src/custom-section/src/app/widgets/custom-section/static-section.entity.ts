import { ViewSelector, WidgetEntity, DisplayName } from '@progress/sitefinity-widget-designers-sdk';

@WidgetEntity('StaticSection', 'Static section')
export class StaticSectionEntity {
    @ViewSelector([])
    @DisplayName('Section view')
    SfViewName?: string;
}
