import { WidgetContext, htmlAttributes, getCustomAttributes, classNames, getMinimumWidgetContext } from '@progress/sitefinity-nextjs-sdk';
import { StyleGenerator } from '@progress/sitefinity-nextjs-sdk/widgets/styling';
import { RenderView } from '@progress/sitefinity-nextjs-sdk/widgets';
import { RestClient } from '@progress/sitefinity-nextjs-sdk/rest-sdk';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { PARAGAnswerEntity } from './parag-answer.entity';
import { PARAGAnswerViewProps } from './parag-answer.view-props';
import { PARAGAnswerDefaultView } from './parag-answer.view';
import { PARAGApiClient } from '../parag-api-client';
import { PARAGConfig } from '../parag-config';

/**
 * Gets the URL of a single selected image from MixedContentContext.
 */
async function getSingleSelectedImageUrlAsync(image: any | null | undefined): Promise<string | null> {
    if (!image || !image.ItemIdsOrdered || image.ItemIdsOrdered.length !== 1) {
        return null;
    }

    let imageItem: any;

    try {
        imageItem = await RestClient.getItem<any>({
            type: 'Telerik.Sitefinity.Libraries.Model.Image',
            id: image.ItemIdsOrdered[0]
        });
    } catch {
        imageItem = null;
    }

    if (imageItem && imageItem.Id === image.ItemIdsOrdered[0]) {
        return imageItem.Url || null;
    }

    return null;
}

export async function PARAGAnswer(props: WidgetContext<PARAGAnswerEntity>) {
    const { span } = Tracer.traceWidget(props, true);
    const entity = props.model.Properties;
    let dataAttributes = htmlAttributes(props);
    const defaultClass = entity.CssClass;
    const marginClass = entity.Margins && StyleGenerator.getMarginClasses(entity.Margins);

    dataAttributes['className'] = classNames(defaultClass, marginClass);
    const customAttributes = getCustomAttributes(entity.Attributes, 'Answer');

    const versionInfo = await PARAGApiClient.getVersionInfoAsync();
    const version = versionInfo?.ProductVersion;

    const assistantAvatarUrl = await getSingleSelectedImageUrlAsync(entity.AssistantAvatar)
        || PARAGConfig.getCdnUrl('chat-avatar.svg', version);

    const cdnUrls = {
        jqueryUrl: PARAGConfig.getCdnUrl('jquery.min.js', version),
        markedUrl: PARAGConfig.getCdnUrl('marked.min.js', version),
        chatJsUrl: PARAGConfig.getCdnUrl('sf-assistant-chat.js', version),
        chatServiceUrl: PARAGConfig.getCdnUrl('parag-chat-service.js', version),
        widgetCssUrl: PARAGConfig.getCdnUrl('sf-assistant-chat-widget.min.css', version),
        widgetJsUrl: PARAGConfig.getCdnUrl('sf-assistant-widget.js', version)
    };

    const viewProps: PARAGAnswerViewProps = {
        title: entity.Title || 'AI answer',
        assistantAvatarUrl: assistantAvatarUrl,
        showSources: entity.ShowSources,
        showFeedback: entity.ShowFeedback,
        searchedPhraseLabel: entity.ShowSearchedPhrase ? entity.SearchedPhraseLabel || 'Answer for "{0}"' : null,
        notice: entity.ShowNotice ? entity.Notice || 'AI answer may contain mistakes.' : null,
        positiveFeedbackTooltip: entity.PositiveFeedbackTooltip || 'Helpful',
        negativeFeedbackTooltip: entity.NegativeFeedbackTooltip || 'Not helpful',
        thankYouMessage: entity.ThankYouMessage || 'Thank you for your feedback!',
        expandAnswerLabel: entity.ExpandAnswerLabel || 'Show more',
        collapseAnswerLabel: entity.CollapseAnswerLabel || 'Show less',
        loadingLabel: entity.LoadingLabel || 'Putting together an answer',
        cdnUrls,
        attributes: { ...dataAttributes, ...customAttributes },
        widgetContext: getMinimumWidgetContext(props)
    };

    const viewName = entity.SfViewName;

    return (
      <RenderView
        viewName={viewName}
        widgetKey={props.model.Name}
        traceSpan={span}
        viewProps={viewProps}>
        <PARAGAnswerDefaultView {...viewProps} />
      </RenderView>
    );
}
