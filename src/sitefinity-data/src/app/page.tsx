import Page from './[...slug]/page';
import { Metadata } from 'next';
import { initRendering, pageMetadata } from '@progress/sitefinity-nextjs-sdk/pages';
import { WidgetExecutionError } from '@progress/sitefinity-nextjs-sdk';
import { widgetRegistry } from './widget-registry';

export async function generateMetadata({ searchParams }: any): Promise<Metadata> {
    initRendering(widgetRegistry, WidgetExecutionError);
    return await pageMetadata({ params: {slug: []}, searchParams });
}

export default async function HomePage({ searchParams }: any) {
    return Page({ params: {slug: []}, searchParams: searchParams || {} });
}
