import Page from './[...slug]/page';
import { Metadata } from 'next';
import { pageMetadata } from '@progress/sitefinity-nextjs-sdk/pages';

export async function generateMetadata({ searchParams }: any): Promise<Metadata> {
    return await pageMetadata({ params: {slug: []}, searchParams });
}

export default async function HomePage({ searchParams }: { searchParams: Promise<{ [key: string]: string }>}) {
    return Page({ params: Promise.resolve({slug: []}), searchParams});
}
