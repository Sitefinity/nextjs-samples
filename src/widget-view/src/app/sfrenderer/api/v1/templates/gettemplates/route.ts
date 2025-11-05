export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { RestClient, RENDERER_NAME, PageTemplateCategoryDto, PageTemplateCategoryType, QueryParamNames } from '@progress/sitefinity-nextjs-sdk/rest-sdk';
import { templateRegistry } from '../../../../../template-registry';
import { env } from 'process';

export async function GET(request: Request) {
    const parsedUrl = new URL(request.url);

    let selectedPages: string[] = [];
    const selectedItemsParamValue = parsedUrl.searchParams.get('ids');
    if (selectedItemsParamValue) {
        try {
            selectedPages = selectedItemsParamValue.split(',').map(x => x.trim());
        } catch {
            console.error(`Could not parse selected pages input string to JSON Array. Original string -> ${selectedItemsParamValue}`);
        }
    }

    // prepare additional headers and query params
    const additionalHeaders: {[key: string]: string} = {};
    const host = request.headers.get('host') || '';
    additionalHeaders['host'] = host;
    const cookie = (await cookies()).toString();

    RestClient.addAuthHeaders(cookie, additionalHeaders);

    const additionalQueryParams: { [key: string]: string } = {};
    if (parsedUrl.searchParams.has('sf_site')) {
        additionalQueryParams['sf_site'] = parsedUrl.searchParams.get('sf_site') as string;
    }

    if (parsedUrl.searchParams.has(QueryParamNames.Culture)) {
        additionalQueryParams[QueryParamNames.Culture] = parsedUrl.searchParams.get(QueryParamNames.Culture) as string;
    }

    // try to get templates from the server
    let templates: PageTemplateCategoryDto[] = [];
    const type = parsedUrl.searchParams.get('entitySetName');
    if (type) {
        templates = await RestClient.getTemplates({ type, selectedPages: selectedPages, additionalHeaders, additionalQueryParams });
    } else {
        console.error(`Could not parse entity set type. Original string -> ${type}`);
    }

    // Hack for the old SF: if there are legacy templates for the selected pages, do not add the NextJs ones
    if (process.env.SF_NEXT_GEN !== 'true' && process.env.SF_NEXT_GEN !== '1' && selectedPages.length > 0) {
        const foundLegacyTemplateCategory = templates.find(x => x.Subtitle !== 'New editor' && x.Type !== PageTemplateCategoryType.CurrentlyUsed);
        if (foundLegacyTemplateCategory) {
            return NextResponse.json({
                value: templates
            });
        }
    }

    let templatesToSkip: string[] = [];

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
                templatesToSkip.push(exists);
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
        if (templatesToSkip.indexOf(key) === -1) {
            reactCategory.Templates.push({
                Framework: 1,
                Id: '00000000-0000-0000-0000-000000000000',
                Name: `${RENDERER_NAME}.${key}`,
                ThumbnailUrl: '/assets/thumbnail-default.png',
                Title: templateRegistry[key].title,
                UsedByNumberOfPages: 0,
                Renderer: 'NextJS'
            });
            allNewEditorTemplateNames.push(key);
        }
    }

    try {
        const templateStatisticsResponse = await RestClient.getTemplatesStatistics({ templateNames: allNewEditorTemplateNames, additionalHeaders, additionalQueryParams });
        templateStatisticsResponse.forEach(templateStat => {
            const template = reactCategory?.Templates.find(x => x.Name === `${RENDERER_NAME}.${templateStat.Name}`);
            if (template) {
                template.UsedByNumberOfPages = templateStat.Count;
            }
        });
    } catch (error) {
        if (env.NODE_ENV !== 'production') {
            console.log('Page template statistics are not yet implemented in SF Next: ' + error);
        }
    }

    // Check if there is currently used template
    let currentlyUsed = templates.find(x => x.Type === PageTemplateCategoryType.CurrentlyUsed || x.Title === 'Currently used');
    if (currentlyUsed && currentlyUsed.Templates.length === 1) {
        currentlyUsed.Templates.forEach(x => (x.Framework as any) = 'React');

        const foundSameReactTemplate = reactCategory.Templates.find(x => x.Title === currentlyUsed!.Templates[0].Title && x.Name === currentlyUsed!.Templates[0].Name);
        if (foundSameReactTemplate) {
            currentlyUsed.Templates[0] = foundSameReactTemplate;
            reactCategory.Templates = reactCategory.Templates.filter(x => x.Title !== currentlyUsed!.Templates[0].Title && x.Name !== currentlyUsed!.Templates[0].Name);
        }

        // move currently used category to top
        const index = templates.indexOf(currentlyUsed);
        templates.splice(index, 1);
        templates.splice(0, 0, currentlyUsed);
    }

    // filter other renderers templates
    templates = templates.
        filter(x => x.Type === PageTemplateCategoryType.CurrentlyUsed ||
            x.Templates.some(y => y.Renderer === 'NextJS') || x.Templates.every(y => !y.Renderer));

    return NextResponse.json({
        value: templates
    });
}
