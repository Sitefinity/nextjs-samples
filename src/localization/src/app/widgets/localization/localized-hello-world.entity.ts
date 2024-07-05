import { WidgetEntity } from '@progress/sitefinity-widget-designers-sdk';

@WidgetEntity('LocalizedHelloWorld', 'Localized hello world')
export class LocalizedHelloWorldEntity {
    Content: string | null = null;
}
