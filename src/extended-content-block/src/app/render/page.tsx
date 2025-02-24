import { RenderWidget } from '@progress/sitefinity-nextjs-sdk/pages';

export default async function Render({ searchParams }: { searchParams: { [key: string]: string } }) {
    return RenderWidget({ searchParams });
}
