import { WidgetEntity } from '@progress/sitefinity-widget-designers-sdk';

@WidgetEntity('CarType', 'Car type')
export class CarTypeEntity {
    SfFieldType!: string;
    SfFieldName!: string;
}
