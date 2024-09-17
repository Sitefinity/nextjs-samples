# Extend Content List Widget
An example on how to extend the views of the content list widget by providing an implementation for a [custom list view](./cards-list-custom.view.tsx) and a [custom details view](./custom-detail.view.tsx).

## Project setup
To setup the project follow the instructions [here](./../../README.md#project-setup).

## List Views

To define your own set of list views in the code, you must do the following:

1. Create a .tsx file that holds implementation of your custom list view. The component's props is an object of type **ContentListMasterViewProps**:

The model has a property called **items** which contains all the content items that need to be rendered.
The property is automatically populated with objects that contain all the properties defined in the FieldMappings(in the **ListFieldMapping** prop of the entity) as well as property named **Original** that holds the original content item returned from Sitefinity. These items are of type **SdkItem**, which is the base class for working with the Rest services in Sitefinity.

2. [Extend the entity](#extending-the-entity-and-views-metadata):
- add the fields metadata for the new view

3. [Register the extended entity and custom view in the widget registry](#register-the-extended-entity-and-custom-views)

## Views metadata

The view metadata must be passed to the **ListFieldMapping** and **CssClasses** properties of the entity in the **FieldMappings** attribute. It contains all of the mappings between views and their corresponding metadata.

### Mappings
The metadata for mappings serves the purpose to create reusable views that can be used across different content types. This is achieved by providing a list of fields and their types. Thus when selecting different content types, each of the provided fields by the view can be mapped to a corresponding field of the selected content type. An example can be found [here](./extended-content-list.entity.ts).

The supported field types are the following:
* ShortText - for string fields
* LongText - for html fields
* Text - for all kinds of string fields (including LongText)
* YesNo - for boolean fields
* DateTime - for dates
* Number - for all kinds of numbers
* Classification - for classifications like Tags, Categories etc..
* Address - for address fields
* RelatedData - for related data like News, Blogs, Dynamic
* RelatedImages - for related images
* RelatedVideos - for related videos
* RelatedDocuments - for related documents

All of these fields are almost a 1:1 mapping with the custom fields dialog in the administrative interface. The entries for the mappings are case sensitive, so be sure to provide an exact match of the field name.

## Detail Views

To define your own set of custom detail views in the code, you must do the following:

1. Create a .tsx file that holds implementation of the details view. The component accepts a single property **props**.

2. The model for the view must be of type:
**ContentListDetailViewProps**

The **ContentListDetailViewProps** contains a property called **detailItem** which refers to the resolved item. The item property is of type **SdkItem**. This object contains all field values of the content item.

Field values can be accessed by name from **props.detailItem**
Example:

props.detailItem?.MyShortTextFieldName

3. [Register the extended entity and custom view in the widget registry](#register-the-extended-entity-and-custom-views)

## Extending the entity and views metadata

In order to register your custom views and their metadata you have to extend the content list entity and modify some of its properties.

To register the custom views metadata you have to pass it in the **@FieldMappings** attribute of the **ListFieldMapping** and **CssClasses** properties.

Note: Decorators added in the extended entity, which are also present in the base entity, override the base ones. Decorators that are not being overriden in the extended entity
are being inherited from the base entity.

``` ts
export class ExtendedContentListEntity extends ContentListEntity {
    @FieldMappings(viewMeta)
    ListFieldMapping: Array<FieldMapping> | null = null;

    @CssFieldMappings(viewMeta, true)
    CssClasses: Array<{ FieldName: string; CssClass: string; }> | null = null;
}
```

## Register the extended entity and custom views

To register the newly created views and the extended entity you need to go to the file [widget-registry](../../../src/app/widget-registry.ts) and to add a new entry like so:

``` typescript
const customWidgetRegistry: WidgetRegistry = {
    widgets: {
        'SitefinityContentList': {
            entity: ExtendedContentListEntity,
            componentType: ContentList,
            editorMetadata: {
                Title: 'Content list',
                Category: 'Content',
                Section: 'Lists',
                EmptyIconText: 'Select content',
                EmptyIcon: 'plus-circle',
                IconName: 'content-list'
            },
            ssr: true,
            views: {
                'ListWithImage': ListWithImageView,
                'ListWithSummary': ListWithSummaryView,
                'CardsListCustom': CardsListCustomView,
                'Details.BlogPosts.Default': BlogPostDetailView,
                'Details.Dynamic.Default': DynamicDetailView,
                'Details.Events.Default': EventDetailView,
                'Details.ListItems.Default': ListItemDetailView,
                'Details.Custom': CustomDetailView,
                'Details.News.Default': NewsItemDetailView
            }
        },
    }
};
```
