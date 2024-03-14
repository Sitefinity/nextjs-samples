export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { RestClient } from '@progress/sitefinity-nextjs-sdk/rest-sdk';

export async function GET(request: Request, { params }: { params: { type: string } }) {
    const parsedUrl = new URL(request.url);

    let selectedPages: string[] = [];
    if (parsedUrl.searchParams.has('selectedPages')) {
        selectedPages = parsedUrl.searchParams.get('selectedPages')!.split(',');
    }

    const additionalHeaders: {[key: string]: string} = {};
    const cookie = cookies().toString();

    RestClient.addAuthHeaders(cookie, additionalHeaders);

    const additionalQueryParams: { [key: string]: string } = {};
    if (parsedUrl.searchParams.has('sf_site')) {
        additionalQueryParams['sf_site'] = parsedUrl.searchParams.get('sf_site') as string;
    }

    const templates = await RestClient.getTemplates({ type: params.type, selectedPages: selectedPages, additionalHeaders, additionalQueryParams });
    const reactCategoryIndex = templates.findIndex(x => x.Title === 'NextJS templates');

    if (reactCategoryIndex !== -1) {
        const reactCategory = templates.splice(reactCategoryIndex, 1)[0];
        reactCategory.Templates.forEach(t => (t.Framework as any) = 'React');
        templates.splice(0, 0, reactCategory);
    } else {
        templates.splice(0, 0, {
            Subtitle: 'New editor',
            Title: 'NextJS Templates',
            Type: 0,
            Visible: true,
            Templates: [
                {
                    Framework: 1,
                    Id: '00000000-0000-0000-0000-000000000000',
                    Name: 'NextJS.Default',
                    ThumbnailUrl: '/assets/thumbnail-default.png',
                    Title: 'Default',
                    UsedByNumberOfPages: 0
                }
            ]
        });
    }

    return NextResponse.json({
        value: templates
    });
}
