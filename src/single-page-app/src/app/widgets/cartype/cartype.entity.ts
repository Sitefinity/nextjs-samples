import { Browsable, WidgetEntity } from '@progress/sitefinity-widget-designers-sdk';

@WidgetEntity('CarType', 'Car type')
export class CarTypeEntity {
    @Browsable(false)
    SfFieldType!: string;

    @Browsable(false)
    SfFieldName!: string;
}
