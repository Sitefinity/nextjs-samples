import { PARAGAnswerEntity } from './parag-answer.entity';
import { ViewPropsBase } from '@progress/sitefinity-nextjs-sdk/widgets';

export interface PARAGAnswerCdnUrls {
    jqueryUrl: string;
    markedUrl: string;
    chatJsUrl: string;
    chatServiceUrl: string;
    widgetJsUrl: string;
    widgetCssUrl: string;
}

export interface PARAGAnswerViewProps extends ViewPropsBase<PARAGAnswerEntity> {
    title: string;
    assistantAvatarUrl: string | null;
    showSources: boolean;
    notice: string | null;
    showFeedback: boolean | null;
    searchedPhraseLabel: string | null;
    positiveFeedbackTooltip: string;
    negativeFeedbackTooltip: string;
    thankYouMessage: string;
    expandAnswerLabel: string;
    collapseAnswerLabel: string;
    loadingLabel: string;
    cdnUrls: PARAGAnswerCdnUrls;
}
