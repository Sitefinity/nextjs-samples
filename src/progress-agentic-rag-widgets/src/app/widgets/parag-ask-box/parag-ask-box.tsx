import { WidgetContext, htmlAttributes, getCustomAttributes, classNames, getMinimumWidgetContext, RestClientForContext } from '@progress/sitefinity-nextjs-sdk';
import { RestSdkTypes, PageItem } from '@progress/sitefinity-nextjs-sdk/rest-sdk';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { PARAGAskBoxEntity } from './parag-ask-box.entity';
import { StyleGenerator, StylingConfig, VisibilityStyle } from '@progress/sitefinity-nextjs-sdk/widgets/styling';
import { PARAGAskBoxViewProps } from './parag-ask-box.view-props';
import { RenderView } from '@progress/sitefinity-nextjs-sdk/widgets';
import { PARAGAskBoxDefaultView } from './parag-ask-box.view';

export async function PARAGAskBox(props: WidgetContext<PARAGAskBoxEntity>) {
    const { span, ctx } = Tracer.traceWidget(props, true);
    const entity = props.model.Properties;
    const requestContext = props.requestContext;
    let dataAttributes = htmlAttributes(props);
    const defaultClass = entity.CssClass;
    const marginClass = entity.Margins && StyleGenerator.getMarginClasses(entity.Margins);

    dataAttributes['className'] = classNames(defaultClass, marginClass);
    const customAttributes = getCustomAttributes(entity.Attributes, 'AskBox');

    let searchResultsPageUrl: string | null = null;
    if (entity.RedirectPageMode === 'redirect' && entity.SearchResultsPage?.Content?.length && entity.SearchResultsPage.Content[0].Variations?.length) {
        try {
            const searchResultsPage = await RestClientForContext.getItem<PageItem>(entity.SearchResultsPage, { type: RestSdkTypes.Pages, culture: requestContext.culture, traceContext: ctx });
            if (searchResultsPage) {
                searchResultsPageUrl = searchResultsPage['ViewUrl'];
            }
        } catch (error) {
            /* empty */
        }
    }

    const viewProps: PARAGAskBoxViewProps = {
        knowledgeBoxName: entity.KnowledgeBoxName,
        searchConfigurationName: entity.ConfigurationName,
        resultsPageUrl: searchResultsPageUrl,
        suggestions: JSON.stringify(entity.Suggestions),
        placeholder: entity.Placeholder,
        buttonLabel: entity.ButtonLabel,
        suggestionsLabel: entity.SuggestionsLabel,
        activeClass: StylingConfig.ActiveClass,
        visibilityClassHidden: StylingConfig.VisibilityClasses[VisibilityStyle.Hidden],
        searchAutocompleteItemClass: StylingConfig.SearchAutocompleteItemClass,
        attributes: { ...dataAttributes, ...customAttributes },
        widgetContext: getMinimumWidgetContext(props)
    };

    const viewName = props.model.Properties.SfViewName;

    return (
      <RenderView
        viewName={viewName}
        widgetKey={props.model.Name}
        traceSpan={span}
        viewProps={viewProps}>
        <PARAGAskBoxDefaultView {...viewProps} />
      </RenderView>
    );
}
