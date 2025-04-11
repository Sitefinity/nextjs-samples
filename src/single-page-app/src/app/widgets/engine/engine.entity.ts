import { Browsable, WidgetEntity } from '@progress/sitefinity-widget-designers-sdk';

@WidgetEntity('Engine', 'Engine')
export class EngineEntity {
    @Browsable(false)
    SfFieldType!: string;
    
    @Browsable(false)
    SfFieldName!: string;
}
