import { Metadata } from 'next';
import { RenderPage, WidgetExecutionError, initRendering, pageMetadata } from '@progress/sitefinity-nextjs-sdk';
import { widgetRegistry } from '../widget-registry';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function generateMetadata({ params, searchParams }: any): Promise<Metadata> {
    initRendering(widgetRegistry, WidgetExecutionError);
    return await pageMetadata({ params, searchParams });
}

export default async function Page({ params, searchParams }: any) {
    initRendering(widgetRegistry, WidgetExecutionError);
    return RenderPage({ params, searchParams });
}
