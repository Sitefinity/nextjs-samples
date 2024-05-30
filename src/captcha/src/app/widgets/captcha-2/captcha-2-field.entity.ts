import { ContentSection, ContentSectionTitles, DefaultValue, WidgetEntity } from '@progress/sitefinity-widget-designers-sdk';

@WidgetEntity('Captcha2', 'Google Captcha2')
export class Captcha2FieldEntity {
    @ContentSection(ContentSectionTitles.LabelsAndContent, 1)
    @DefaultValue('')
    Label: string | null = '';
}
