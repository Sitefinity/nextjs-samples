import { RenderLazyWidgets, initRendering } from '@progress/sitefinity-nextjs-sdk/pages';
import { WidgetExecutionError } from '@progress/sitefinity-nextjs-sdk';
import { widgetRegistry } from '../widget-registry';

export default async function Render({ searchParams }: { searchParams: { [key: string]: string } }) {
    await initRendering(widgetRegistry, WidgetExecutionError);
    return RenderLazyWidgets({ searchParams });
}
