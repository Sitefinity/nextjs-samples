import { FileTypes, NumericRange } from '@progress/sitefinity-nextjs-sdk/widgets/forms';
import { Browsable, Category, Choice, ChoiceItem, ChoiceWithText, Range, ColorPalette, ComplexType, ConditionalVisibility, Content, ContentContainer, ContentSection, ContentSectionTitles, Copy, DataModel, DataType, DateSettings, DecimalPlaces, DefaultValue, Description, DescriptionExtended, DisplayName, DisplaySettings, DynamicLinksContainer, FallbackToDefaultValueWhenEmpty, Group, KeysValues, KnownContentTypes, KnownFieldTypes, LengthDependsOn, LinkModel, MaxLength, MinLength, Mirror, MixedContentContext, Placeholder, PropertyCategory, Readonly, Required, SectionsOrder, StringLength, StylingConfig, Suffix, TableView, TaxonomyContent, Url, ViewSelector, WidgetEntity, WidgetLabel } from '@progress/sitefinity-widget-designers-sdk';
import { BigComplexObject, ComplexObject, ComplexObjectNoDefaults, ComplexObjectWithContent, ComplexObjectWithLinks, ComplexWithNesting, ComplexWithNestingTable, ComplexWithNestingTableTable, MultiLevelComplexObject } from './models';

enum EnumSingle {
    Value1 = 'Value1',
    Value2 = 'Value2',
    Value3 = 'Value3',
}

const EnumSingleChoices: ChoiceItem[] = [
    {Value: EnumSingle.Value1},
    {Value: EnumSingle.Value2},
    {Value: EnumSingle.Value3}
];

const FirstBasicSection = 'First basic section';
const SecondBasicSection = 'Second basic section';
const FirstAdvancedSection = 'First advanced section';
const SecondAdvancedSection = 'Second advanced section';
const stylingConfig: StylingConfig = {
    ColorPalettes: {
        Default: {
            Colors: ['#FFADAD', '#FFA4E1', '#F59AFF', '#8BF4FF', '#92FFFB', '#9EFFC9', '#FFFFAE', '#FFEB8D', '#E4CFC5', '#DCECF5', '#FFFFFF', '#FF7A7B', '#FF71AD', '#C267DC', '#57C1FF', '#5FD0C8', '#6BDE96', '#FFFF7B', '#FFB85A', '#B19D92', '#A9B9C2', '#cccccc', '#FF4848', '#DC3E7B', '#8F34A9', '#238EFC', '#2C9D95', '#38AB63', '#FFE048', '#ED8527', '#7E6A5F', '#76868F', '#000000'],
            DefaultColor: '#DCECF5'
        }
    }
};

@WidgetEntity('AllProperties', 'AllProperties')
@SectionsOrder([FirstBasicSection, SecondBasicSection, FirstAdvancedSection, SecondAdvancedSection])
export class AllPropertiesEntity {
    @Readonly()
    public Readonly: string | null = null;

    // @DataType('string')
    @Browsable(false)
    NotBrowsable!: string;

    @Category(PropertyCategory.Advanced)
    @Url('Enter valid URL.')
    @DisplayName('URL field')
    @DataType('string')
    public UrlField: string | null = null;

    // @EmailAddress('Enter valid email.')
    // @DisplayName('Email field')
    // @DataType('string')
    // public EmailField: string | null = null;

    @Placeholder('This is the placeholder')
    @DataType('string')
    public PlaceHolderProp: string | null = null;

    @DisplayName('Plain description')
    @Category(PropertyCategory.Advanced)
    @Description('This is the description')
    @DataType('string')
    public DescriptionProp: string | null = null;

    @DisplayName('Description')
    @DescriptionExtended({Description: 'This is the extended description', InlineDescription: 'Inline description', InstructionalNotes: 'Instructional notes'})
    @DataType('string')
    public DescriptionExtendedProp: string | null = null;

    @Copy(true)
    @DataType('number')
    public ExcludedFromCopyProp: number = 0;

    @Range(1, 20, 'Стойност между {1} и {2}.')
    @DataType('number')
    @DecimalPlaces(10)
    public DoubleValidation: number = 0;

    @DataType(KnownFieldTypes.Html)
    @Placeholder('This is the placeholder')
    @ContentContainer()
    public HtmlField: string | null = null;

    @DataType(KnownFieldTypes.TextArea)
    @DefaultValue('This is some text.')
    public TextAreaField: string | null = null;

    @DataType(KnownFieldTypes.Password)
    public Password: string | null = null;

    @ColorPalette('Company', stylingConfig)
    @DataType(KnownFieldTypes.Color)
    public ColorField: string | null = null;

    @ColorPalette('Default', stylingConfig)
    @DataType(KnownFieldTypes.Color)
    public ColorFieldDefaultPalette: string | null = null;

    @ContentSection(ContentSectionTitles.Limitations, 0)
    @DataType(KnownFieldTypes.Range)
    @Suffix('MB')
    @DataModel(NumericRange)
    public Range: NumericRange | null = null;

    @ContentSection(ContentSectionTitles.Limitations, 1)
    @DataType(KnownFieldTypes.RangeLimitation)
    @DisplayName('Character count')
    @Suffix('characters')
    public RangeLimitation: NumericRange | null = null;

    @DataType(KnownFieldTypes.FileTypes)
    @DisplayName('File types')
    @DataModel(FileTypes)
    public FileTypes: FileTypes | null = null;

    @ViewSelector([{Value: 'Default'}, {Value: 'Second'}])
    @DataType('string')
    public ViewName: string | null = 'Default';

    @DefaultValue('Second')
    @ViewSelector([{Value: 'Default'}, {Value: 'Second'}])
    @DataType('string')
    public ViewNameDefaultValue: string | null = null;

    @DefaultValue('invalid')
    @ViewSelector([{Value: 'Default'}, {Value: 'Second'}])
    @DataType('string')
    public ViewNameDefaultValueInvalid: string | null = null;

    @DynamicLinksContainer()
    @DataModel(ComplexObjectWithLinks)
    @DataType(ComplexType.Complex)
    public ObjectWithLinks: ComplexObjectWithLinks | null = null;

    @DynamicLinksContainer()
    @DataModel(ComplexObjectWithLinks)
    @DataType(ComplexType.Enumerable)
    public ArrayOfObjectWithLinks: ComplexObjectWithLinks[] | null = null;

    @DataType('linkInsert')
    public Link: LinkModel | null = null;

    @Required()
    @DataType('linkInsert')
    public LinkRequired: LinkModel | null = null;

    @DataType('linkSelector')
    public LinkModel: LinkModel | null = null;

    @DataType('linkSelector')
    public LinkModelMultiple: LinkModel[] | null = null;

    @DisplaySettings(true)
    @DataType('string')
    public HiddenField: string | null = null;

    @DisplaySettings(false, true)
    @DataType('string')
    public HiddenContent: string | null = null;

    @StringLength(6, 'Value should be between {1} and {2} symbols.', 2)
    @DisplayName('String length validation')
    @DataType('string')
    public StringLengthValidation: string | null = null;

    @MinLength(2, 'The message length must be at least {1} symbols.')
    @MaxLength(10, 'The message must be less than {1} symbols.')
    @DataType('string')
    public StringValidation: string | null = null;

    @Required('This is required string {0}.')
    @DataType('string')
    public StringFieldRequired: string | null = null;

    @DefaultValue('custom')
    @ContentSection(FirstBasicSection, 0)
    @DataType('string')
    public DefaultValueString: string | null = null;

    @DefaultValue('custom')
    @FallbackToDefaultValueWhenEmpty()
    @ContentSection(FirstBasicSection, 1)
    @DataType('string')
    public DefaultValueStringWithFallback: string | null = null;

    @ContentSection(FirstBasicSection, 0)
    @DataType('string')
    public PlainString: string | null = null;

    @Mirror('PlainString')
    @ContentSection(SecondBasicSection, 2)
    @DataType('string')
    public MirroredField: string | null = null;

    @Required('This is required date.')
    @DataType('datetime')
    public DateFieldRequired: Date | null = null;

    @DefaultValue('2020-09-11T06:38:11.170Z')
    @ContentSection(SecondBasicSection, 3)
    @DataType(KnownFieldTypes.DateTime)
    public NullableDateWithDefault?: Date | null = null;

    @DataType(KnownFieldTypes.DateTime)
    public NullableDate: Date | null = null;

    @DataType(KnownFieldTypes.DateTime)
    @DefaultValue('2020-09-11T06:38:11.170Z')
    public DefaultValueDateTimeFromString: Date | null = null;

    @DataType(KnownFieldTypes.DateTime)
    @DefaultValue('2020-09-11T06:38:11.170Z')
    public DefaultValueDateTimeFromDate: Date | null = null;

    @DefaultValue('2020-13-09T06:38:11.170Z')
    @DataType(KnownFieldTypes.DateTime)
    public DefaultValueDateTimeInvalid: Date | null = null;

    @DateSettings(false)
    @DataType(KnownFieldTypes.DateTime)
    public DateFieldWithoutTime: Date | null = null;

    @Required('This is required int.')
    @DataType('number')
    public IntFieldRequired: number | null = 0;

    @Range(1, 20, 'Value should be between {1} and {2}.')
    @DataType('number')
    public IntegerValidation: number | null = 0;

    @DefaultValue(42)
    @DataType('number')
    public IntDefaultValue: number | null = 0;

    @DataType('number')
    public PlainInt: number | null = 0;

    @DataType('number')
    public NullableInt?: number | null = null;

    @DefaultValue(42)
    @DataType('number')
    public NullableIntWithDefault?: number | null = null;

    @Required('This is required bool.')
    @DataType('bool')
    public BoolFieldRequired: boolean | null = false;

    @ConditionalVisibility('{"conditions":[{"fieldName":"BoolFieldRequired","operator":"Equals","value":"true"}]}')
    @DataType('bool')
    public ConditionalProp: boolean | null = false;

    @DefaultValue(true)
    @DataType('bool')
    public BoolDefaultValue: boolean | null = null;

    @DataType('bool')
    public PlainBool: boolean | null = false;

    @DataType('bool')
    public NullableBool?: boolean | null = null;

    @DefaultValue(true)
    @DataType('bool')
    public NullableBoolWithDefault?: boolean | null = null;

    @Group('Options')
    @DisplayName('Checkbox field')
    @DefaultValue(true)
    @DataType(KnownFieldTypes.CheckBox)
    public CheckboxField: boolean | null = null;

    @Group('Options')
    @DisplayName('Checkbox field')
    @DefaultValue(true)
    @DataType(KnownFieldTypes.CheckBox)
    public CheckboxField2: boolean | null = null;

    @DefaultValue(EnumSingle.Value2)
    @Choice(EnumSingleChoices)
    public EnumDefaultValue: EnumSingle | null = null;

    @DefaultValue(EnumSingle.Value2)
    @Choice(EnumSingleChoices)
    public NullableEnumDefaultValue: EnumSingle | null = null;

    @DefaultValue('Vaal')
    @Choice(EnumSingleChoices)
    public EnumDefaultValueInvalid: EnumSingle | null = null;

    @DataType('string')
    @Choice(EnumSingleChoices)
    public EnumNoDefaultValue: EnumSingle = EnumSingle.Value1;

    @DataType(KnownFieldTypes.ChipChoice)
    @Choice(EnumSingleChoices)
    public EnumChipChoice: EnumSingle = EnumSingle.Value1;

    @DataModel(ComplexObject)
    @DataType(ComplexType.Complex)
    public Complex: ComplexObject | null = null;

    @DataModel(ComplexObjectWithContent)
    @DataType(ComplexType.Complex)
    public ComplexWithContent:  ComplexObjectWithContent | null = null;

    @TableView('TableTitle')
    @DataModel(ComplexObject)
    @DataType(ComplexType.Complex)
    public ComplexTable: ComplexObject | null = null;

    @DataModel(MultiLevelComplexObject)
    @DataType(ComplexType.Complex)
    public MultiLevelComplexObject: MultiLevelComplexObject | null = null;

    @TableView('BigTableTitle')
    @DataModel(BigComplexObject)
    @DataType(ComplexType.Complex)
    public BigComplexTable: BigComplexObject | null = null;

    @DataModel(ComplexObject)
    @DataType(ComplexType.Dictionary)
    public DictionaryWithInitializer: {[key:string]: ComplexObject} = {};

    @DataModel(ComplexObject)
    @DataType(ComplexType.Dictionary)
    public Dictionary: {[key:string]: ComplexObject} | null = null;

    @DataType(ComplexType.Enumerable, 'string')
    public List: string[] | null = null;

    @DataType(ComplexType.Enumerable, 'boolean')
    public ListBool: boolean[] | null = null;

    @DataModel(ComplexObject)
    @DataType(ComplexType.Enumerable)
    public ListComplexObject: ComplexObject[] | null = null;

    @TableView({Reorderable: true, Selectable: true, MultipleSelect: true})
    @DataModel(ComplexObject)
    // @DataType(ComplexType.Enumerable)
    public ListTableView: ComplexObject[] | null = null;

    @DataType(ComplexType.Enumerable)
    @DataModel(ComplexObjectNoDefaults)
    public ListComplexObjectNoDefaults: ComplexObjectNoDefaults[] | null = null;

    @DataModel(MultiLevelComplexObject)
    @DataType(ComplexType.Enumerable)
    public ListMultiLevelComplexObject: MultiLevelComplexObject[] | null = null;

    @Content({Type: KnownContentTypes.Images, AllowMultipleItemsSelection: true})
    public Images: MixedContentContext | null = null;

    @Content({Type: KnownContentTypes.Pages})
    public Pages: MixedContentContext | null = null;

    @Content({Type: KnownContentTypes.News})
    public News: MixedContentContext | null = null;

    @Content({Type: KnownContentTypes.News, LiveData: true})
    public NewsLive: MixedContentContext | null = null;

    @Content({Type: KnownContentTypes.Pages, AllowMultipleItemsSelection: false, DisableInteraction: true, ShowSiteSelector: true})
    public Page: MixedContentContext | null = null;

    @Content({Type: 'Telerik.Sitefinity.DynamicTypes.Model.Pressreleases.PressRelease'})
    public PressReleases: MixedContentContext | null = null;

    @Content({Type: KnownContentTypes.Albums})
    public Albums: MixedContentContext | null = null;

    @Content({Type: KnownContentTypes.DocumentLibraries, AllowMultipleItemsSelection: false, AllowCreate: false, Provider: 'secondlibraries'})
    public DocumentLibrary: MixedContentContext | null = null;

    @TaxonomyContent({Type: KnownContentTypes.Tags})
    public Tags: MixedContentContext | null = null;

    @TaxonomyContent({Type: KnownContentTypes.Categories})
    public Categories: MixedContentContext | null = null;

    @TaxonomyContent({Type: 'geographical-regions'})
    public CustomTaxonomy: MixedContentContext | null = null;

    @Choice({Choices: [{'Title':'- Select -','Name':'default','Value':'default'},{'Title':'Prefix','Name':'prefix','Value':'prefix'}, {'Title':'Suffix','Name':'suffix','Value':'suffix'}] })
    @DataType(KnownFieldTypes.DropdownWithText)
    @DescriptionExtended({ Description: 'This is the extended description', InlineDescription: 'Inline description', InstructionalNotes: 'Instructional notes' })
    @DisplayName('Dummy display name')
    @DataModel(ChoiceWithText)
    public ChoiceWithText: ChoiceWithText | null = null;

    @DisplayName('Enum as radio choice field')
    @DataType(KnownFieldTypes.RadioChoice)
    @Choice(EnumSingleChoices)
    public EnumRadioChoice: EnumSingle | null = EnumSingle.Value1;

    @DefaultValue(1)
    @DisplayName('Integer as choice field')
    @DataType(KnownFieldTypes.ChipChoice)
    @Choice({ Choices: [{'Title':'1 level','Name':'1','Value':1,'Icon':null},{'Title':'2 levels','Name':'2','Value':2,'Icon':null},{'Title':'3 levels','Name':'3','Value':3,'Icon':null}] })
    public IntAsChoice: number | null = null;

    @DefaultValue(1)
    @DisplayName('Integer as dropdown field')
    @DataType(KnownFieldTypes.Choices)
    @Choice({ Choices: [{'Title':'1 level','Name':'1','Value':1,'Icon':null},{'Title':'2 levels','Name':'2','Value':2,'Icon':null},{'Title':'3 levels','Name':'3','Value':3,'Icon':null}] })
    public IntAsDropdownChoice: number | null = null;

    @Content()
    public AllTypesSelector: MixedContentContext | null = null;

    @DataModel(ComplexWithNesting)
    // @DataType(ComplexType.Complex)
    public ComplexWithNesting: ComplexWithNesting | null = null;

    @DataType(ComplexType.Enumerable, 'number')
    public IntList: number[] | null = null;

    @DataType(ComplexType.Enumerable, 'boolean')
    public BoolList: boolean[] | null = null;

    @DataType(ComplexType.Dictionary, 'string')
    public StringDict: {[key: string]: string} | null = null;

    @DataType(ComplexType.Dictionary, 'number')
    public IntDict: {[key: string]: number} | null = null;

    @DataType(ComplexType.Dictionary, 'boolean')
    public BoolDict: {[key: string]: boolean} | null = null;

    @TableView()
    @DataModel(ComplexWithNesting)
    @DataType(ComplexType.Complex)
    public ComplexWithNestingTable: ComplexWithNesting | null = null;

    @TableView()
    @DataModel(ComplexWithNestingTable)
    public ComplexWithNestingTableTable: ComplexWithNestingTable | null = null;

    @DataModel(ComplexWithNesting)
    @DataType(ComplexType.Enumerable)
    public ComplexWithNestingList: ComplexWithNesting[] | null = null;

    @DataModel(ComplexWithNestingTableTable)
    @DataType(ComplexType.Enumerable)
    public ComplexWithNestingTableTableTable: ComplexWithNestingTableTable[] | null = null;

    @WidgetLabel()
    SfWidgetLabel: string = 'AllProperties';

    @Category(PropertyCategory.Advanced)
    @ContentSection(FirstAdvancedSection, 3)
    @DataType('string')
    public AFirstAdvancedProp: string | null = null;

    @Category(PropertyCategory.Advanced)
    @ContentSection(FirstAdvancedSection, 0)
    @DataType('string')
    public BFirstAdvancedProp: string | null = null;

    @Category(PropertyCategory.Advanced)
    @ContentSection(SecondAdvancedSection, 0)
    @DataType('string')
    public ASecondAdvancedProp: string | null = null;

    @Category(PropertyCategory.Advanced)
    @ContentSection(SecondAdvancedSection, 2)
    @DataType('string')
    public BSecondAdvancedProp: string | null = null;

    @Category(PropertyCategory.Advanced)
    @ContentSection('Attributes', 2)
    @DisplayName('Attributes for...')
    @DataType(KnownFieldTypes.Attributes)
    @DataModel(KeysValues)
    @LengthDependsOn(null, '', '', '[{"Name": "AllPropertiesWidget", "Title": "AllPropertiesWidget"}]')
    public Attributes: {[key: string]: KeysValues[]} | null = null;
}
