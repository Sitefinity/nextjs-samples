import { WidgetEntity } from '@progress/sitefinity-widget-designers-sdk';

@WidgetEntity('Color', 'Color')
export class ColorEntity {
    SfFieldType!: string;
    SfFieldName!: string;
}
