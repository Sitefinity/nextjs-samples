import { ContentSection, ContentSectionTitles, DefaultValue, WidgetEntity } from '@progress/sitefinity-widget-designers-sdk';

@WidgetEntity('Captcha3', 'Google Captcha3')
export class Captcha3FieldEntity {
    @ContentSection(ContentSectionTitles.LabelsAndContent, 1)
    @DefaultValue('')
    Label: string | null = '';
}
