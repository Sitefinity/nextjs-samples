# Extend Content Block Widget
An example on how to replace(extend) the functional component of the Content Block widget and how to extend(replace) the default entity type enabling to add additional properties to the designer.

This example demonstrates 2 things:
- how to replace the base functional component with a new one that applies some custom logic and still reuses the out of the box component
- how to add an additional property in the widget designer

## Project setup
To setup the project follow the instructions [here](./../../README.md#project-setup).

## Implementation explained:

You need to create a new functional component for the widget that will replace the existing one. It should have properties of type *WidgetContext<T>* where *T* is the widget entity type.
Inside the component you can apply your custom logic (appending some text) and then either return the out of the box widget component with some modified props(as done in this example) or return an entirely custom view to be rendered.

``` ts
	export async function ExtendedContentBlock(props: WidgetContext<ExtendedContentBlockEntity>) {
		props.model.Properties.Content += props.model.Properties.TextToAppend;

		return <ContentBlock {...props}/>;
	}
```

To add an additional property in the widget designer you need to create a new entity that inherits the base one. The entity should contain the property to be added in the designer.

``` ts
	export class ExtendedContentBlockEntity extends ContentBlockEntity {
		@DisplayName("Text to append")
		@Category("Advanced")
		TextToAppend: string | null = null;
	}
```

Finally you need to register the newly created component and entity so that they will replace the existing ones.

For the pupose we need to go to the file [widget-registry](../../../src/app/widget-registry.ts) and to add a new entry like so:

``` typescript
const customWidgetRegistry: WidgetRegistry = {
    widgets: {
        'SitefinityContentBlock': {
            entity: ExtendedContentBlockEntity, // registration of the widget designer
            componentType: ExtendedContentBlock, // registration of the widget component
            editorMetadata: {
                Title: 'Content block',
                Category: 'Content',
                Section: 'Basic',
                HasQuickEditOperation: true,
                IconName: 'content-block'
            },
            ssr: true
        }
    }
};
```

## Upgrade considerations
If you plan to replace the functional component of the out of the box widgets, please bear in mind that you would not get the changes that we introduced in the component with each release (rare occasion, but not unlikely).

It is recommended to use custom views in case you need modifications. If overriding the functional component is absolutely necessary, try to reuse as much as possible from the OOB logic the widget provides.
