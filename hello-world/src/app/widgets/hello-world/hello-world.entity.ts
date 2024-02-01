import { WidgetEntity } from '@progress/sitefinity-widget-designers-sdk';

@WidgetEntity('HelloWorld', 'Hello world')
export class HelloWorldEntity {
    Content: string | null = null;
}
