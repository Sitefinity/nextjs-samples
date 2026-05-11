import { WidgetContext, getMinimumWidgetContext, htmlAttributes, getCustomAttributes, classNames } from '@progress/sitefinity-nextjs-sdk';
import { StyleGenerator } from '@progress/sitefinity-nextjs-sdk/widgets/styling';
import { RenderView } from '@progress/sitefinity-nextjs-sdk/widgets';
import { RootUrlService, RestClient } from '@progress/sitefinity-nextjs-sdk/rest-sdk';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { PARAGResultsEntity } from './parag-results.entity';
import { FindResultItem, PARAGResultsViewProps } from './parag-results.view-props';
import { PARAGResultsDefaultView } from './parag-results.view';

interface FindResponse {
    Resources: { [key: string]: Resource };
}

interface Resource {
    Fields: { [key: string]: Field };
    Thumbnail: string;
    Title: string;
    Origin: Origin;
}

interface Field {
    Paragraphs: { [key: string]: Paragraph };
}

interface Paragraph {
    Order: number;
    Text: string;
}

interface Origin {
    Url: string;
}

async function performFind(
    searchQuery: string,
    knowledgeBoxName: string,
    configurationName: string | undefined,
    traceContext?: any
): Promise<FindResultItem[]> {
    try {
        const url = `${RootUrlService.getServerCmsUrl()}/parag/find`;
        const response = await RestClient.sendRequest<FindResponse>({
            url,
            method: 'POST',
            data: {
                KnowledgeBoxName: knowledgeBoxName,
                Query: searchQuery,
                ConfigurationName: configurationName,
                Show: ['basic', 'origin', 'values'],
                Take: 200
            },
            traceContext
        });

        const resultItems: FindResultItem[] = [];

        if (response && response.Resources) {
            for (const resourceKey of Object.keys(response.Resources)) {
                const resource = response.Resources[resourceKey];
                if (!resource) {
                    continue;
                }

                const allParagraphs: Paragraph[] = [];

                if (resource.Fields) {
                    for (const fieldKey of Object.keys(resource.Fields)) {
                        const field = resource.Fields[fieldKey];
                        if (!field || !field.Paragraphs) {
                            continue;
                        }

                        for (const paraKey of Object.keys(field.Paragraphs)) {
                            const paragraph = field.Paragraphs[paraKey];
                            if (paragraph) {
                                allParagraphs.push(paragraph);
                            }
                        }
                    }
                }

                allParagraphs.sort((a, b) => a.Order - b.Order);
                resultItems.push({ Title: resource.Title, Link: resource.Origin.Url, Order: allParagraphs[0]?.Order ?? 0 });
            }
        }

        resultItems.sort((a, b) => a.Order - b.Order);
        return resultItems;
    } catch {
        return [];
    }
}

export async function PARAGResults(props: WidgetContext<PARAGResultsEntity>) {
    const { span, ctx } = Tracer.traceWidget(props, true);
    const entity = props.model.Properties;
    const requestContext = props.requestContext;
    let dataAttributes = htmlAttributes(props);
    const marginClass = entity.Margins && StyleGenerator.getMarginClasses(entity.Margins);
    const customAttributes = getCustomAttributes(entity.Attributes, 'Results');

    dataAttributes['className'] = classNames(entity.CssClass, marginClass);

    const searchQuery = requestContext.searchParams?.['searchQuery'];
    const knowledgeBoxName = requestContext.searchParams?.['knowledgeBoxName'];
    const searchConfigurationName = requestContext.searchParams?.['searchConfigurationName'];

    let searchResults: FindResultItem[] | null = null;
    let resultsHeader = entity.NoResultsHeader.replace('{0}', searchQuery || '');

    if (searchQuery && knowledgeBoxName) {
        searchResults = await performFind(
            searchQuery,
            knowledgeBoxName,
            searchConfigurationName,
            ctx
        );

        if (searchResults.length > 0) {
            resultsHeader = entity.SearchResultsHeader.replace('{0}', searchQuery);
        }
    }

    const viewProps: PARAGResultsViewProps<PARAGResultsEntity> = {
        searchResults,
        resultsHeader,
        resultsNumberLabel: entity.ResultsNumberLabel,
        pageSize: entity.PageSize ?? 20,
        attributes: { ...dataAttributes, ...customAttributes },
        widgetContext: getMinimumWidgetContext(props)
    };

    return (
      <RenderView
        viewName={entity.SfViewName}
        widgetKey={props.model.Name}
        traceSpan={span}
        viewProps={viewProps}>
        <PARAGResultsDefaultView {...viewProps} />
      </RenderView>
    );
}
