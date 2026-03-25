import { PARAGAskBoxEntity } from './parag-ask-box.entity';
import { ViewPropsBase } from '@progress/sitefinity-nextjs-sdk/widgets';

export interface PARAGAskBoxViewProps extends ViewPropsBase<PARAGAskBoxEntity> {
    knowledgeBoxName: string | null;
    searchConfigurationName: string | null;
    resultsPageUrl: string | null;
    suggestions: string;
    placeholder: string;
    buttonLabel: string;
    suggestionsLabel: string;
    activeClass: string;
    visibilityClassHidden: string;
    searchAutocompleteItemClass: string;
}
