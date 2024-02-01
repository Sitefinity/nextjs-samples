import { Metadata } from 'next';
import { RenderPage, WidgetExecutionError, initRendering, pageMetadata } from '@progress/sitefinity-nextjs-sdk';
import { widgetRegistry } from '../widget-registry';

export async function generateMetadata({ params, searchParams }: any): Promise<Metadata> {
    initRendering(widgetRegistry, WidgetExecutionError);
    return await pageMetadata({ params, searchParams });
}

export default async function Page({ params, searchParams }: any) {
    initRendering(widgetRegistry, WidgetExecutionError);
    return RenderPage({ params, searchParams });
}
