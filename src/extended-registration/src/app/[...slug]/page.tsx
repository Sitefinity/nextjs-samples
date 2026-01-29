import { Metadata } from 'next';
import { RenderPage, pageMetadata } from '@progress/sitefinity-nextjs-sdk/pages';
import { templateRegistry } from '../template-registry';

export async function generateMetadata({ params, searchParams }: { params: Promise<{ slug: string[] }>, searchParams: Promise<{ [key: string]: string }> }): Promise<Metadata> {
    return await pageMetadata({ params, searchParams });
}

export default async function Page({ params, searchParams }: { params: Promise<{ slug: string[] }>, searchParams: Promise<{ [key: string]: string }> }) {
    return RenderPage({ params, searchParams, templates: templateRegistry });
}
