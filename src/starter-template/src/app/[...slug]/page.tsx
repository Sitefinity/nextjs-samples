import { Metadata } from 'next';
import { RenderPage, WidgetExecutionError, initRendering, pageMetadata } from '@progress/sitefinity-nextjs-sdk';
import { widgetRegistry } from '../widget-registry';
import { RestClient } from '@progress/sitefinity-nextjs-sdk/rest-sdk';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function generateMetadata({ params, searchParams }: any): Promise<Metadata> {
    initRendering(widgetRegistry, WidgetExecutionError);
    return await pageMetadata({ params, searchParams });
}

export default async function Page({ params, searchParams }: any) {
    initRendering(widgetRegistry, WidgetExecutionError);
    console.log(`rendering page with params -> ${JSON.stringify(params)}`);

    if (decodeURIComponent(params.slug[0]).startsWith('host:')) {
        RestClient.host = decodeURIComponent(params.slug[0]).replace('host:', '');
        params.slug.splice(0, 1);
        console.log(`added host as a variable -> ${RestClient.host}`);
    }
    
    return RenderPage({ params, searchParams });
}
