import { RenderLazyWidgets, WidgetExecutionError, initRendering } from '@progress/sitefinity-nextjs-sdk';
import { widgetRegistry } from '../widget-registry';

export default async function Render({ searchParams }: { searchParams: { [key: string]: string } }) {
    await initRendering(widgetRegistry, WidgetExecutionError);
    return RenderLazyWidgets({ searchParams });
}
