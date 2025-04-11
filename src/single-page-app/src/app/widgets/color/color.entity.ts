import { Browsable, WidgetEntity } from '@progress/sitefinity-widget-designers-sdk';

@WidgetEntity('Color', 'Color')
export class ColorEntity {
    @Browsable(false)
    SfFieldType!: string;
    
    @Browsable(false)
    SfFieldName!: string;
}
