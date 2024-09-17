import { Category, ContentSection, ContentSectionTitles, DefaultValue, Description, WidgetEntity } from '@progress/sitefinity-widget-designers-sdk';

@WidgetEntity('SitefinitySection', 'Car configuration section')
export class CarConfiguratorSectionEntity {
    @ContentSection(ContentSectionTitles.LabelsAndContent, 1)
    @DefaultValue('')
    Label: string | null = '';
}
