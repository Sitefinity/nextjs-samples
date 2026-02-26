import { Attributes, Category, Choice, ConditionalVisibility, Content, ContentSection, DataType, DefaultValue, Description, DisplayName, KnownFieldTypes, MixedContentContext, Placeholder, PropertyCategory, WidgetEntity, WidgetLabel } from '@progress/sitefinity-widget-designers-sdk';

export enum DisplayMode {
    Modal = 'Modal',
    Inline = 'Inline'
}

@WidgetEntity('PARAGAssistant', 'PARAG assistant')
export class PARAGAssistantEntity {
    @ContentSection('AI assistant', 1)
    @DisplayName('Agentic RAG connection')
    @Description('[{\"Type\":1,\"Chunks\":[{\"Value\":\"A connection to a specific knowledge box in Progress Agentic RAG. Select which connection this widget should use to search and answer questions.\",\"Presentation\":[]}]},{\"Type\":1,\"Chunks\":[{\"Value\":\"Manage connections in \",\"Presentation\":[]},{\"Value\":\"Administration > Progress Agentic Rag connections\",\"Presentation\":[3]}]}]')
    @DataType(KnownFieldTypes.Choices)
    @Choice({ ServiceUrl: '/Default.GetConfiguredKnowledgeBoxes()', ServiceWarningMessage: 'No PARAG knowledge boxes are found.' })
    @Placeholder('Select connection')
    KnowledgeBoxName: string | null = null;

    @ContentSection('AI assistant', 2)
    @DisplayName('Search configuration')
    @Description('[{\"Type\":1,\"Chunks\":[{\"Value\":\"A saved set of search settings that the AI uses to find content.\",\"Presentation\":[]}]},{\"Type\":1,\"Chunks\":[{\"Value\":\"Can be found in Progress Agentic Rag portal \",\"Presentation\":[]},{\"Value\":\"Search > Saved configurations\",\"Presentation\":[3]}]}]')
    ConfigurationName: string | null = null;

    @ContentSection('AI assistant', 2)
    @DisplayName('Nickname of the assistant')
    @Description('Name displayed before assistant\'s messages in the chat.')
    Nickname: string = 'AI assistant';

    @ContentSection('AI assistant', 3)
    @DisplayName('Greeting message')
    @Description('You can customize the bot\'s initial words by adding a phrase that triggers conversation on a specific topic.')
    @DataType(KnownFieldTypes.TextArea)
    GreetingMessage: string | null = null;

    @ContentSection('AI assistant', 4)
    @DisplayName('Avatar of the assistant')
    @Content({
        Type: 'Telerik.Sitefinity.Libraries.Model.Image',
        AllowMultipleItemsSelection: false
    })
    AssistantAvatar?: MixedContentContext;

    @ContentSection('AI assistant', 5)
    @DisplayName('Display sources')
    @Description('In answers, display links to sources of information.')
    @DefaultValue(true)
    @DataType(KnownFieldTypes.ChipChoice)
    @Choice('[{"Title":"Yes","Name":"Yes","Value":"True","Icon":null},{"Title":"No","Name":"No","Value":"False","Icon":null}]')
    ShowSources: boolean = true;

    @ContentSection('AI assistant', 6)
    @DisplayName('Enable visitor feedback')
    @Description('If enabled, site visitors can provide feedback on the assistant\'s answer in the chat window.')
    @DefaultValue(true)
    @DataType(KnownFieldTypes.ChipChoice)
    @Choice('[{"Title":"Yes","Name":"Yes","Value":"True","Icon":null},{"Title":"No","Name":"No","Value":"False","Icon":null}]')
    ShowFeedback: boolean = true;

    @ContentSection('Chat window', 1)
    @DisplayName('Chat window mode')
    @Description('[{"Type":1,"Chunks":[{"Value":"Display overlay: ","Presentation":[0]},{"Value":"Chat appears in a small window, usually in the bottom right corner of the screen. It requires user interaction to open and overlays parts of the page content.","Presentation":[]}]},{"Type":1,"Chunks":[{"Value":"Display inline: ","Presentation":[0]},{"Value":"Chat area is integrated into the page layout and does not overlay other elements. Suitable for long assistant responses and prompts.","Presentation":[]}]}]')
    @DataType(KnownFieldTypes.RadioChoice)
    @Choice([
        { Title: 'Display overlay', Value: DisplayMode.Modal },
        { Title: 'Display inline', Value: DisplayMode.Inline }
    ])
    DisplayMode: DisplayMode = DisplayMode.Modal;

    @ContentSection('Chat window', 2)
    @DisplayName('Opening chat icon')
    @Description('Select a custom icon for opening chat window. If left empty, default icon will be displayed.')
    @Content({
        Type: 'Telerik.Sitefinity.Libraries.Model.Image',
        AllowMultipleItemsSelection: false
    })
    @ConditionalVisibility('{"conditions":[{"fieldName":"DisplayMode","operator":"Equals","value":"Modal"}]}')
    OpeningChatIcon?: MixedContentContext;

    @ContentSection('Chat window', 3)
    @DisplayName('Closing chat icon')
    @Description('Select a custom icon for closing chat window. If left empty, default icon will be displayed.')
    @Content({
        Type: 'Telerik.Sitefinity.Libraries.Model.Image',
        AllowMultipleItemsSelection: false
    })
    @ConditionalVisibility('{"conditions":[{"fieldName":"DisplayMode","operator":"Equals","value":"Modal"}]}')
    ClosingChatIcon?: MixedContentContext;

    @ContentSection('Chat window', 4)
    @DisplayName('Container ID')
    @Description('ID of the HTML element that will host the chat widget.')
    @DataType('string')
    @DefaultValue('sf-assistant-chat-container')
    @ConditionalVisibility('{"conditions":[{"fieldName":"DisplayMode","operator":"Equals","value":"Inline"}]}')
    ContainerId: string = 'sf-assistant-chat-container';

    @ContentSection('Message box', 1)
    @DisplayName('Placeholder text in the message box')
    @DataType('string')
    @DefaultValue('Ask anything...')
    PlaceholderText: string = 'Ask anything...';

    @ContentSection('Message box', 2)
    @DisplayName('Notice')
    @DefaultValue('You are interacting with an AI-powered assistant and the responses are generated by AI.')
    @Description('Text displayed under the message box, informing users that they are interacting with AI.')
    @DataType(KnownFieldTypes.TextArea)
    Notice: string = 'You are interacting with an AI-powered assistant and the responses are generated by AI.';

    @WidgetLabel()
    SfWidgetLabel: string = 'AI assistant';

    @DisplayName('CSS class')
    @Category(PropertyCategory.Advanced)
    CssClass: string | null = null;

    @Category(PropertyCategory.Advanced)
    @DisplayName('CSS for custom design')
    @Placeholder('type URL or path to file...')
    CustomCss: string | null = null;

    @Attributes('SitefinityAssistant')
    Attributes?: { [key: string]: Array<{ Key: string, Value: string}> };
}
