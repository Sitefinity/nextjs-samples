import { ComplexType, Content, DataModel, DataType, DefaultValue, DisplayName, KnownContentTypes, MixedContentContext, Model, TableView } from '@progress/sitefinity-widget-designers-sdk';


@Model()
export class ComplexObjectWithLinks {
    @DataType('linkInsert')
    public Link: LinkModel | null = null;

    @DataType('linkSelector')
    public LinkModel: LinkModel | null = null;

    @DataType('linkSelector')
    public LinkModelMultiple: LinkModel[] | null = null;
}

@Model()
export class ComplexObject {
    @DisplayName('String prop')
    @DefaultValue('test')
    public ChildString: string | null = null;

    @DisplayName('Int prop')
    @DefaultValue(42)
    @DataType('number')
    public ChildInt: number | null = null;
}

@Model()
export class ComplexObjectNoDefaults {
    @DisplayName('Boolean prop')
    @DataType('boolean')
    public BoolProp?: boolean | null = null;

    @DisplayName('Int prop')
    @DataType('number')
    public ChildInt?: number | null = null;
}

@Model()
export class BigComplexObject {
    @DisplayName('String prop1')
    @DefaultValue('test1')
    public ChildString1: string | null = null;

    @DisplayName('String prop2')
    @DefaultValue('test2')
    public ChildString2: string | null = null;

    @DisplayName('String prop3')
    @DefaultValue('test3')
    public ChildString3: string | null = null;

    @DisplayName('String prop4')
    @DefaultValue('test4')
    public ChildString4: string | null = null;

    @DisplayName('String prop5')
    @DefaultValue('test5')
    public ChildString5: string | null = null;

    @DisplayName('String prop6')
    @DefaultValue('test6')
    public ChildString6: string | null = null;
}

@Model()
export class MultiLevelComplexObject {
    @DisplayName('String prop')
    @DefaultValue('testouter')
    public ChildString: string | null = null;

    @DisplayName('Child complex prop')
    @DataModel(ComplexObject)
    public ChildComplexObject: ComplexObject | null = null;
}

@Model()
export class ComplexObjectWithContent {
    @Content({Type: KnownContentTypes.Events})
    public Events: MixedContentContext | null = null;
}

@Model()
export class ComplexNested {
    @DataType('string')
    public NestedString: string | null = null;

    @DataType(ComplexType.Enumerable, 'string')
    public NestedStringList: string[] | null = null;
}

@Model()
export class ComplexWithNesting {
    @DataModel(ComplexNested)
    public NestedComplex: ComplexNested | null = null;

    @DataType(ComplexType.Enumerable, 'string')
    public StringList: string[] | null = null;

    @DataType(ComplexType.Dictionary, 'string')
    public StringDict: {[key: string]: string} | null = null;
}

@Model()
export class ComplexWithNestingTable {
    @TableView()
    @DataModel(ComplexNested)
    public NestedComplex: ComplexNested | null = null;

    @DataType(ComplexType.Enumerable, 'string')
    public StringList: string[] | null = null;
}

@Model()
export class ComplexWithNestingTableTable {
    @DataModel(ComplexNested)
    @DataType(ComplexType.Enumerable)
    public NestedComplex: ComplexNested[] | null = null;

    @DataType(ComplexType.Enumerable, 'string')
    public StringList: string[] | null = null;
}

export class LinkModel {
    // noop
}
