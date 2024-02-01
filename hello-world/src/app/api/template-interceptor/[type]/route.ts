export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { RestClient } from '@progress/sitefinity-nextjs-sdk/rest-sdk';

export async function GET(request: Request, { params }: { params: { type: string } }) {
    const parsedUrl = new URL(request.url);

    let selectedPages: string[] = [];
    if (parsedUrl.searchParams.has('selectedPages')) {
        selectedPages = parsedUrl.searchParams.get('selectedPages')!.split(',');
    }

    const templates = await RestClient.getTemplates({ type: params.type, selectedPages: selectedPages });
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

    return NextResponse.json({
        value: templates
    });
}
