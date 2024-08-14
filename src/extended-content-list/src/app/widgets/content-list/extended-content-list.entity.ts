import { CssFieldMappings, FieldMapping, FieldMappings } from '@progress/sitefinity-widget-designers-sdk';
import { ContentListEntity } from '@progress/sitefinity-nextjs-sdk/widgets';

const viewMeta = {
    CardsListCustom: [
        { fieldTitle: 'Heading', fieldType: 'ShortText' }
    ],
    CardsList: [
        { fieldTitle: 'Image', fieldType: 'RelatedImage' },
        { fieldTitle: 'Title', fieldType: 'ShortText' },
        { fieldTitle: 'Text', fieldType: 'Text' }
    ],
    ListWithSummary: [
        { fieldTitle: 'Title', fieldType: 'ShortText'},
        { fieldTitle: 'Text', fieldType: 'Text'},
        { fieldTitle: 'Publication date', fieldType: 'DateTime'}
    ],
    ListWithImage: [
        { fieldTitle: 'Title', fieldType: 'ShortText' },
        { fieldTitle: 'Image', fieldType: 'RelatedImage' },
        { fieldTitle: 'Text', fieldType: 'Text' }
    ]
};

export class ExtendedContentListEntity extends ContentListEntity {
    /**
     * Decorators defined here will override the ones from the base entity.
     * Other decorators will be inherited
     */
    @FieldMappings(viewMeta)
    ListFieldMapping: Array<FieldMapping> | null = null;

    /**
     * Decorators defined here will override the ones from the base entity.
     * Other decorators will be inherited
     */
    @CssFieldMappings(viewMeta, true)
    CssClasses: Array<{ FieldName: string; CssClass: string; }> | null = null;
}
