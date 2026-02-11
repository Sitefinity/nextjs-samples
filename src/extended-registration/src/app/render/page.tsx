import { RenderWidget } from '@progress/sitefinity-nextjs-sdk/pages';

export default async function Render({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
    return RenderWidget({ searchParams });
}
