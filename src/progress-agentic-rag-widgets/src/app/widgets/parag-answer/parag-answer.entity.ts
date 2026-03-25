import {
    Attributes,
    Category,
    Choice,
    Content,
    ContentSection,
    DataType,
    DefaultValue,
    Description,
    DisplayName,
    Group,
    KnownFieldTypes,
    MixedContentContext,
    PropertyCategory,
    WidgetEntity,
    WidgetLabel
} from '@progress/sitefinity-widget-designers-sdk';
import { RestSdkTypes } from '@progress/sitefinity-nextjs-sdk/rest-sdk';
import { Margins } from '@progress/sitefinity-widget-designers-sdk/decorators/margins';
import { ViewSelector } from '@progress/sitefinity-widget-designers-sdk/decorators/view-selector';
import { ContentSectionTitles } from '@progress/sitefinity-widget-designers-sdk/common';
import { OffsetStyle } from '@progress/sitefinity-nextjs-sdk/widgets/styling';

const SetupSectionName = 'AI answer setup';

@WidgetEntity('PARAGAnswer', 'PARAG answer')
export class PARAGAnswerEntity {
    @ContentSection(SetupSectionName, 0)
    @DefaultValue('AI answer')
    @DisplayName('Answer label')
    @Description('Label shown above the AI-generated text.')
    Title: string = 'AI answer';

    @ContentSection(SetupSectionName, 1)
    @Content({ Type: RestSdkTypes.Image, AllowMultipleItemsSelection: false })
    @DisplayName('Icon')
    AssistantAvatar: MixedContentContext | null = null;

    @ContentSection(SetupSectionName, 2)
    @DisplayName('Searched phrase')
    @DefaultValue(true)
    @DataType(KnownFieldTypes.CheckBox)
    @Group('Include...')
    ShowSearchedPhrase: boolean = true;

    @ContentSection(SetupSectionName, 3)
    @DisplayName('Sources')
    @Description('In AI-generated answer, display links to sources of information.')
    @DefaultValue(true)
    @DataType(KnownFieldTypes.CheckBox)
    @Group('Include...')
    ShowSources: boolean = true;

    @ContentSection(SetupSectionName, 4)
    @DisplayName('Notice')
    @Description('Text displayed under the answer, informing users that they are interacting with AI.')
    @DefaultValue(true)
    @DataType(KnownFieldTypes.CheckBox)
    @Group('Include...')
    ShowNotice: boolean = true;

    @ContentSection(SetupSectionName, 5)
    @DisplayName('Enable visitor feedback')
    @Description('If enabled, site visitors can provide feedback on the generated answer.')
    @DefaultValue(true)
    @DataType(KnownFieldTypes.ChipChoice)
    @Choice([
        { Title: 'Yes', Name: 'Yes', Value: 'True', Icon: null },
        { Title: 'No', Name: 'No', Value: 'False', Icon: null }
    ])
    ShowFeedback: boolean | null = true;

    @ContentSection(ContentSectionTitles.DisplaySettings, 0)
    @ViewSelector([{ Title: 'Default', Name: 'Default', Value: 'Default', Icon: null }])
    @DisplayName('PARAG answer template')
    @DefaultValue('Default')
    SfViewName: string = 'Default';

    @ContentSection(ContentSectionTitles.DisplaySettings, 1)
    @Margins('PARAG Answer')
    Margins?: OffsetStyle;

    @WidgetLabel()
    SfWidgetLabel: string = 'PARAG answer';

    @Category(PropertyCategory.Advanced)
    @DisplayName('Custom CSS class')
    CssClass: string | null = null;

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages, 0)
    @DefaultValue('Answer for "{0}"')
    @DisplayName('Searched phrase label')
    SearchedPhraseLabel: string = 'Answer for "{0}"';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages, 1)
    @DefaultValue('AI answer may contain mistakes.')
    @DisplayName('Notice')
    Notice: string = 'AI answer may contain mistakes.';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages, 2)
    @DefaultValue('Helpful')
    @DisplayName('Positive feedback tooltip')
    PositiveFeedbackTooltip: string = 'Helpful';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages, 3)
    @DefaultValue('Not helpful')
    @DisplayName('Negative feedback tooltip')
    NegativeFeedbackTooltip: string = 'Not helpful';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages, 4)
    @DefaultValue('Thank you for your feedback!')
    @DisplayName('Thank you message')
    ThankYouMessage: string = 'Thank you for your feedback!';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages, 5)
    @DefaultValue('Show more')
    @DisplayName('Expand answer')
    ExpandAnswerLabel: string = 'Show more';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages, 6)
    @DefaultValue('Show less')
    @DisplayName('Collapse answer')
    CollapseAnswerLabel: string = 'Show less';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages, 7)
    @DefaultValue('Putting together an answer')
    @DisplayName('Loading text')
    LoadingLabel: string = 'Putting together an answer';

    @Attributes('Answer', 'PARAG answer', 0)
    Attributes: { [key: string]: Array<{ Key: string, Value: string }> } | null = null;
}
