export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { RestClient, RENDERER_NAME, PageTemplateCategoryDto, PageTemplateCategoryType } from '@progress/sitefinity-nextjs-sdk/rest-sdk';
import { templateRegex } from '../../../../middleware';
import { templateRegistry } from '../../../template-registry';

export async function GET(request: Request, { params }: { params: Promise<{ type: string }> }) {
    const parsedUrl = new URL(request.url);

    let selectedPages: string[] = [];

    const match = parsedUrl.pathname.match(templateRegex);
    if (match && match.groups) {
        const selectedPagesMatch = match.groups['selectedPages'];
        if (selectedPagesMatch) {
            try {
                const decoded = decodeURIComponent(selectedPagesMatch);
                const formattedJson = decoded.replaceAll('\'', '"');
                selectedPages = JSON.parse(formattedJson);
            } catch {
                console.error(`Could not parse selected pages input string to JSON Array. Original string -> ${selectedPagesMatch}`);
            }
        }
    }

    const additionalHeaders: {[key: string]: string} = {};
    const host = request.headers.get('host') || '';
    additionalHeaders['host'] = host;
    const cookie = (await cookies()).toString();

    RestClient.addAuthHeaders(cookie, additionalHeaders);

    const additionalQueryParams: { [key: string]: string } = {};
    if (parsedUrl.searchParams.has('sf_site')) {
        additionalQueryParams['sf_site'] = parsedUrl.searchParams.get('sf_site') as string;
    }

    // get templates from server
    const templates = await RestClient.getTemplates({ type: (await params).type, selectedPages: selectedPages, additionalHeaders, additionalQueryParams });

    // if there are no 'New editor' templates for the selected pages, do not add the NextJs ones
    if (selectedPages.length > 0) {
        const foundNewTemplateCategory = templates.find(x => x.Subtitle === 'New editor');
        if (!foundNewTemplateCategory) {
            return NextResponse.json({
                value: templates
            });
        }
    }

    let tempaltesToSkip: string[] = [];

    // find whether there is a category that holds templates for the renderer
    const reactCategoryIndex = templates.findIndex(x => x.Title === 'NextJS templates');
    let reactCategory: PageTemplateCategoryDto;

    // if there is such, we should check for templates from the registry that this category already contains.
    // They should be marked in order not to be duplicated
    if (reactCategoryIndex !== -1) {
        reactCategory = templates.splice(reactCategoryIndex, 1)[0];
        reactCategory.Templates.forEach(t => {
            (t.Framework as any) = 'React';

            const exists = Object.keys(templateRegistry).find(x => `${RENDERER_NAME}.${x}` === t.Name);
            if (exists) {
                tempaltesToSkip.push(exists);
            }
        });
    } else {
        reactCategory = {
            Subtitle: 'New editor',
            Title: 'NextJS templates',
            Type: PageTemplateCategoryType.None,
            Visible: true,
            Templates: []
        };
    }

    templates.splice(0, 0, reactCategory);

    // add registry templates to the renderer category
    const allNewEditorTemplateNames: string[] = [];
    for (const key in templateRegistry) {
        if (tempaltesToSkip.indexOf(key) === -1) {
            reactCategory.Templates.push({
                Framework: 1,
                Id: '00000000-0000-0000-0000-000000000000',
                Name: `${RENDERER_NAME}.${key}`,
                ThumbnailUrl: '/assets/thumbnail-default.png',
                Title: templateRegistry[key].title,
                UsedByNumberOfPages: 0
            });
            allNewEditorTemplateNames.push(key);
        }
    }

    // set used by count
    const templateStatisticsResponse = await RestClient.getTemplatesStatistics({ templateNames: allNewEditorTemplateNames, additionalHeaders, additionalQueryParams });
    templateStatisticsResponse.forEach(templateStat => {
        const template = reactCategory?.Templates.find(x => x.Name === `${RENDERER_NAME}.${templateStat.Name}`);
        if (template) {
            template.UsedByNumberOfPages = templateStat.Count;
        }
    });

    // Check if there is currently used template
    let currentlyUsed = templates.find(x => x.Type === PageTemplateCategoryType.CurrentlyUsed);
    if (currentlyUsed && currentlyUsed.Templates.length === 1) {
        currentlyUsed.Templates.forEach(x => (x.Framework as any) = 'React');

        const foundSameReactTemplate = reactCategory.Templates.find(x => x.Name === currentlyUsed!.Templates[0].Name);
        if (foundSameReactTemplate) {
            currentlyUsed.Templates[0] = foundSameReactTemplate;
            reactCategory.Templates = reactCategory.Templates.filter(x => x.Name !== currentlyUsed!.Templates[0].Name);
        }

        // move currently used category to top
        const index = templates.indexOf(currentlyUsed);
        templates.splice(index, 1);
        templates.splice(0, 0, currentlyUsed);
    }

    return NextResponse.json({
        value: templates
    });
}
