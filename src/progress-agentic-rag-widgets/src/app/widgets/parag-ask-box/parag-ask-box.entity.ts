import {
    Category,
    Choice,
    ConditionalVisibility,
    Content,
    ContentSection,
    DataType,
    DefaultValue,
    Description,
    DisplayName,
    KnownFieldTypes,
    MixedContentContext,
    Placeholder,
    PropertyCategory,
    WidgetEntity,
    WidgetLabel,
    Required,
    ViewSelector,
    Margins,
    Attributes
} from '@progress/sitefinity-widget-designers-sdk';
import { ComplexType, ContentSectionTitles } from '@progress/sitefinity-widget-designers-sdk/common';
import { RestSdkTypes } from '@progress/sitefinity-nextjs-sdk/rest-sdk';
import { OffsetStyle } from '@progress/sitefinity-nextjs-sdk/widgets/styling';

const SetupSectionName = 'PARAG ask box setup';

@WidgetEntity('PARAGAskBox', 'PARAG ask box')
export class PARAGAskBoxEntity {
    @ContentSection(SetupSectionName, 0)
    @DisplayName('Agentic RAG connection')
    @Description('[{"Type":1,"Chunks":[{"Value":"A connection to a specific knowledge box in Progress Agentic RAG. Select which connection this widget should use to search and answer questions.","Presentation":[]}]},{"Type":1,"Chunks":[{"Value":"Manage connections in ","Presentation":[]},{"Value":"Administration > Progress Agentic RAG connections","Presentation":[3]}]}]')
    @DataType(KnownFieldTypes.Choices)
    @Choice({ ServiceUrl: '/Default.GetConfiguredKnowledgeBoxes()', ServiceWarningMessage: 'No Agentic RAG connections are found.' })
    @Placeholder('Select connection')
    KnowledgeBoxName: string | null = null;

    @ContentSection(SetupSectionName, 1)
    @DisplayName('Search configuration')
    @Description('[{"Type":1,"Chunks":[{"Value":"A saved set of search settings that the AI uses to find content.","Presentation":[]}]},{"Type":1,"Chunks":[{"Value":"Can be found in Progress Agentic RAG portal ","Presentation":[]},{"Value":"Search > Saved configurations","Presentation":[3]}]}]')
    ConfigurationName: string | null = null;

    @ContentSection(SetupSectionName, 2)
    @DisplayName('After search is submitted...')
    @Description('This is the page where you have dropped the AI answer and/or AI results widgets.')
    @DataType(KnownFieldTypes.RadioChoice)
    @DefaultValue('stay')
    @Choice([
        { Title: 'Stay on the same page', Name: 'stay', Value: 'stay' },
        { Title: 'Redirect to page...', Name: 'redirect', Value: 'redirect' }
    ])
    RedirectPageMode: string = 'stay';

    @ContentSection(SetupSectionName, 3)
    @DisplayName('')
    @Content({ Type: RestSdkTypes.Pages, AllowMultipleItemsSelection: false })
    @Required('Please select a search results page')
    @ConditionalVisibility('{"conditions":[{"fieldName":"RedirectPageMode","operator":"Equals","value":"redirect"}],"inline":"true"}')
    SearchResultsPage: MixedContentContext | null = null;

    @ContentSection(SetupSectionName, 4)
    @DisplayName('Suggestions')
    @Description('Suggestions are example questions or phrases displayed under the AI ask box.')
    @DataType(ComplexType.Enumerable, 'string')
    Suggestions: string[] = [];

    @ContentSection(ContentSectionTitles.DisplaySettings, 0)
    @ViewSelector([{ Title: 'Default', Name: 'Default', Value: 'Default', Icon: null }])
    @DisplayName('AI ask box template')
    SfViewName: string = 'Default';

    @ContentSection(ContentSectionTitles.DisplaySettings, 1)
    @Margins('AI ask box')
    Margins?: OffsetStyle;

    @WidgetLabel()
    SfWidgetLabel: string = 'PARAG ask box';

    @Category(PropertyCategory.Advanced)
    @DisplayName('CSS class')
    CssClass: string | null = null;

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages, 0)
    @DisplayName('AI ask box placeholder text')
    @DefaultValue('Search...')
    Placeholder: string = 'Search...';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages, 1)
    @DisplayName('Submit button label')
    @DefaultValue('Search')
    ButtonLabel: string = 'Search';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages, 2)
    @DisplayName('Suggestions label')
    @DefaultValue('Try searching for:')
    SuggestionsLabel: string = 'Try searching for:';

    @Attributes('AskBox', 'AI ask box', 0)
    Attributes: { [key: string]: Array<{ Key: string, Value: string }> } | null = null;
}
