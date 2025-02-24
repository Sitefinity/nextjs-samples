import { Metadata } from 'next';
import { RenderPage, pageMetadata } from '@progress/sitefinity-nextjs-sdk/pages';
import { templateRegistry } from '../template-registry';

export async function generateMetadata({ params, searchParams }: any): Promise<Metadata> {
    return await pageMetadata({ params, searchParams });
}

export default async function Page({ params, searchParams }: any) {
    return RenderPage({ params, searchParams, templates: templateRegistry });
}
