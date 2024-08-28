# Widget development

## Table of content
- [Overview](#overview)
- [Default widgets](#default-widgets)
- [Create a custom widget](#create-a-custom-widget)
- [Extend the built-in widgets](#extend-the-built-in-widgets)
- [Creating custom views for widgets](#creating-custom-views-for-widgets)

## Overview

The WYSIWYG page editor of Sitefinity CMS works with reusable components called widgets. Widgets provide configurable and reusable parts for page building, which can vary from a simple visual element to complex components for displaying content with rich logic.

The Sitefinity Next.js renderer framework is fully built, including integration with the WYSIWYG page editor. It allows for the development of custom widgets following the React and Next.js development principles. There are some specific integration points that need to be followed to ensure seamless integration with the Sitefinity CMS. This is demonstrated in the [Hello World tutorial](#create-a-custom-widget) below.

## Default widgets

### Registries

The Sitefinity NextJS SDK provides a registry of OOB widgets with 2 variations currently - **defaultWidgetRegistry** and **legacyWidgetRegistry**. With _Sitefinity 15.1_ we have introduced a redesign of the widget selector in the WYSIWYG page editor, which differs visually completely and rearranges the widgets a different manner in terms of categories. Depending on your Sitefinity version, we suggest to use different default registries:

#### After Sitefinity 15.1:
```ts
import { initRegistry, defaultWidgetRegistry } from '@progress/sitefinity-nextjs-sdk';

const customWidgetRegistry: WidgetRegistry = {
    widgets: {
        // ...
    }
};

customWidgetRegistry.widgets = {
    ...defaultWidgetRegistry.widgets,
    ...customWidgetRegistry.widgets
};

export const widgetRegistry: WidgetRegistry = initRegistry(customWidgetRegistry);
```

#### Before Sitefinity 15.1:
```ts
import { initRegistry, legacyWidgetRegistry } from '@progress/sitefinity-nextjs-sdk';

const customWidgetRegistry: WidgetRegistry = {
    widgets: {
        // ...
    }
};

customWidgetRegistry.widgets = {
    ...legacyWidgetRegistry.widgets,
    ...customWidgetRegistry.widgets
};

export const widgetRegistry: WidgetRegistry = initRegistry(customWidgetRegistry);

```

### Form widgets

The OOB form widgets come with mixed SSR and CSR rendering. We provide a full CSR variation of these widgets (_CSRFormComponents_, _SSRFormComponents_, _LegacyCSRFormComponents_, _LegacySSRFormComponents_). To replace the SSR forms with full CSR forms, you need to override them in your registry:

```ts
import { WidgetRegistry, initRegistry, defaultWidgetRegistry, CSRFormComponents  } from '@progress/sitefinity-nextjs-sdk';

const customWidgetRegistry: WidgetRegistry = {
    widgets: {
        // ...
    }
};

customWidgetRegistry.widgets = {
    ...defaultWidgetRegistry.widgets,
    ...customWidgetRegistry.widgets,
    ...CSRFormComponents
};

export const widgetRegistry: WidgetRegistry = initRegistry(customWidgetRegistry);

```

## Create a custom widget

### Overview

Below is described the process of creating a simple widget. This sample demonstrates how to create a component that will be used to display a configurable text content.
You can find the whole sample here >> [Hello world widget](../src/hello-world).

### Creating the component

First you need to create a file that hosts the React component:

1. Create a folder for the widget files, for instance **Hello World** folder
2. Create a **.tsx** file to host our React component, for instance **hello-world.tsx**
3. Paste this code in the file:

``` typescript

import React from 'react';
import { WidgetContext, htmlAttributes } from '@progress/sitefinity-nextjs-sdk';
import { HelloWorldEntity } from './hello-world.entity';

export function HelloWorld(props: WidgetContext<HelloWorldEntity>) {

    // attributes are needed for the widget to be visible in edit mode
    const dataAttributes = htmlAttributes(props);
    return (
      <h1 {...dataAttributes}>{props.model.Properties.Content}</h1>
    );
}

```

>**NOTE**: The **htmlAttributes** function generates the necessary HTML attributes that are required by the WYSIWYG editor to recognize the generated HTML snippet as a widget with its metadata and display its operations and widget designer.

>**NOTE**: The functional component must accept a single argument of type **WidgetContext<T>** where **T** is the entity of the widget. When the page is rendered, the argument is automatically populated. The widget context contains all properties of the widget that are persisted in Sitefinity CMS as well as some metadata about the current request.

### Creating the designer

Next create an entity file, that would describe the widget designer. We have created the Sitefinity Widget Designers SDK to make the process of defining the entity metadata as easy as possible. For additional information, see the[SDK’s documentation on npm](https://www.npmjs.com/package/@progress/sitefinity-widget-designers-sdk). The approach is aiming for parity with the existing Sitefinity autogenerated widget designers. For more information, see [Widget designers](https://www.progress.com/documentation/sitefinity-cms/autogenerated-widget-property-editors-for-asp.net-core).

1. Create a **.ts** file, for instance **hello-world.entity.ts**. This file holds the metadata for the widget designer to construct the designer.
2. Paste this code in the file:

``` typescript
import { WidgetEntity } from '@progress/sitefinity-widget-designers-sdk';

@WidgetEntity('HelloWorld', 'Hello world')
export class HelloWorldEntity {
    Content: string | null = null;
}

```

>**NOTE**: The entity must be decorated with the **@WidgetEntity** attribute. The attrbibute defines the widget's name and caption.

### Registration with the framework

The next step is to register the component implementation and the designer metadata with the Next.js renderer. The widget registry is used to find the component function reference for the widget from the response of the Page Layout service. It is also used when generating metadata for the widget when it is used in the WYSIWYG page editor – labels, visuals etc.

1. Navigate to ...\src\app.
2. Open the **widget-registry.ts** file.
3. Add a new entry to the registry:

``` typescript
import { WidgetRegistry, initRegistry, defaultWidgetRegistry } from '@progress/sitefinity-nextjs-sdk';
import { HelloWorld } from './components/hello-world/hello-world';
import { HelloWorldEntity } from './components/hello-world/hello-world.entity';

const customWidgetRegistry: WidgetRegistry = {
    widgets: {
        'HelloWorld': {
            componentType: HelloWorld, // registration of the widget
            entity: HelloWorldEntity, // registration of the designer
            editorMetadata: {...} // metadata to be displayed in the WYSIWYG edotir - title, available operation, empty content visuals etc.
            ssr: true // whether this is a server rendered or client rendered component
        }
    }
};

customWidgetRegistry.widgets = {
    ...defaultWidgetRegistry.widgets,
    ...customWidgetRegistry.widgets
};

export const widgetRegistry: WidgetRegistry = initRegistry(customWidgetRegistry);
```

#### Define widget properties
After you implement new widgets, you register them with the renderer as shown above so they can appear in the widget toolbox dialog. With the widget entry in the registry using the **editorMetadata** property you can define the following optional properties of the widget:

- **Title** - The display name of the widget, shown in the widget toolbox. For example, **Content block**.
- **Name** - The name of the widget. If set it will override the name defined in the **@WidgetEntity** attribute.
- **Category** - This is one of the categories in which you can place the widget. Categories are predefined and you cannot add custom ones. Instead, you can add your custom widgets in custom sections in the existing categories.
- **Section** - The section of the widget in the parent category. You can define a custom value or use one of the predefined values to add widgets to the existing sections. You cannot change the ordering of the widget sections.
- **EmptyIcon** - The icon shown when the widget does not have any HTML output.
- **EmptyIconText** - The text shown when the widget does not have any HTML output.
- **EmptyIconAction** - The action to perform when the empty text and icon are clicked.
- **Order** - The order of the widget in the section.
- **IconName** - The icon shown for the widget in the widget selector.
- **IconUrl** - Used to define a custom icon to be shown for the widget in the widget selector.
- **Toolbox** - Used to distinguish widgets for pages and forms. For forms widget the value must be 'Forms'.
- **HasQuickEditOperation** - Marks whether the widget has quick edit operations.
- **InitialProperties** - Used to set initial properties for a widget when it is added to the page.

## Extend the built-in widgets

### Overview

Sitefinity Next.js Renderer comes with a [set of built-in widgets](#default-widgets), such as Navigation, Content list, Content block, etc. You can extend these widgets to suit your requirements in the following ways:

- Customize the views of the widgets
- Modify the logic behind the widgets
- Add/Modify fields in the widget designer

>**NOTE**: The source code of the built-in widget is located in the [Next.js SDK](https://github.com/Sitefinity/nextjs-sdk/tree/main/widgets) GitHub repository.

### Customize the views for the widgets

You can add new or override the existing widget views.

You can do this by creating a **.tsx** file to host the view. The view is a standard Next.js functional component.The component accepts a single parameter that holds the view properties coming from the widget.

>**Example for Breadcrumb widget**: ```export function CustomView(props: BreadcrumbViewProps<BreadcrumbEntity>) { }```

After the view is implemented it should be registered in the widget registry:

1. Navigate to ...\src\app.
2. Open the **widget-registry.ts** file.
3. Add the new view the **views** property of the widget entry:

``` typescript
const breadcrumbRegistration = defaultWidgetRegistry.widgets['SitefinityBreadcrumb'];
breadcrumbRegistration.views['BreadcrumbCustomView'] = CustomView;

export const widgetRegistry: WidgetRegistry = initRegistry(defaultWidgetRegistry);
```

>**EXAMPLE**: To view a sample of how to extend the Content list widget's views, see [Extend the Content list widget](../src/extended-content-list) sample.

### Modify the logic behind the widgets

You can modify the default or add custom logic to the behavior of a built-in widget. You can use the [built in widgets codebase](https://github.com/Sitefinity/nextjs-sdk/tree/main/widgets) for reference. This is achieved by replacing the functional component of that widget with a custom one and registering it in the widget registry.
The creation of the new functional component is the same as when [creating a one for a custom widget](#creating-the-component).
To register the new component in the widget registry you have to find the existing entry for the widget and modify its **componentType** property:

``` typescript
const breadcrumbRegistration = defaultWidgetRegistry.widgets['SitefinityBreadcrumb'];
breadcrumbRegistration.componentType = CustomBreadcrumbComponent;

export const widgetRegistry: WidgetRegistry = initRegistry(defaultWidgetRegistry);
```

### Add fields to the widget designer

You can include additional fields in the widget designer.
You do this by extending the default Entity class that serves as the metadata source for the automatic generation of widgets.

We have created the Sitefinity Widget Designers SDK to make the process of defining the entity metadata as easy as possible. For additional information, see the[SDK’s documentation on npm](https://www.npmjs.com/package/@progress/sitefinity-widget-designers-sdk).

>**NOTE**: Decorators added in the extended entity, which are also present in the base entity, override the base ones. Decorators are inherited from the base class.

>**EXAMPLE**: To view a sample of how to extend the Content list widget's entity, see [Extend the Content list widget](../src/extended-content-list) sample.

## Creating custom views for widgets
 To create a custom view for an OOB widget it is needed to have:

  - A function representing a NextJs component that will render the new view
  - That function must accept a [ViewPropsBase\<T>](https://github.com/Sitefinity/nextjs-sdk/blob/main/widgets/common/view-props-base.ts) where `T` is the entity related to the widget. Both the view props and entity can be extended with custom implementations that add additional properties which can be used in your view
  - The HTML of the new view must be wrapped in an element that has the `attributes` provided in the viewProps
  - The view must be registered in the widget registry in the desired widget's `views` property and the entity class of that widget must have either a `SfViewName` or `SfDetailViewName` string properties marked with `@DataType('viewSelector')`.

If an entity class is missing one of the view name properties mentioned above, it can be extended:
```tsx
import { LanguageSelectorEntity } from '@progress/sitefinity-nextjs-sdk';
import { DisplayName, DataType } from '@progress/sitefinity-widget-designers-sdk';

export class LanguageSelectorEntityExtended extends LanguageSelectorEntity {
    @DisplayName('Details view')
    @DataType('viewSelector')
    SfDetailViewName: string;
}
```
### Widget default view
 The view function:
 ```tsx
import { LanguageSelectorEntity, ViewPropsBase } from '@progress/sitefinity-nextjs-sdk';

export function CustomLanguageSelectorView(props: ViewPropsBase<LanguageSelectorEntity>) {
    // attributes are needed for the widget to be visible in edit mode
    const dataAttributes = props.attributes;

    return (
        <div {...dataAttributes}>
            <h1>Extended language selector view</h1>
        </div>
    );
}
 ```
Then this function must be registered in the `views` property for the widget. In this case `LanguageSelectorEntity` has `SfViewName` property so this step is covered:
```tsx
import { initRegistry, defaultWidgetRegistry } from '@progress/sitefinity-nextjs-sdk';

defaultWidgetRegistry.widgets['SitefinityLanguageSelector'].views!['CustomView'] = {
    Title: 'Custom view',
    ViewFunction: CustomLanguageSelectorView
};

export const widgetRegistry: WidgetRegistry = initRegistry(defaultWidgetRegistry);
```

### Widget details view
The widgets that support detail views are Content list and Document list. They can accept custom implementations for the detail rendering:
```tsx
import { ViewPropsBase, ContentListEntity } from '@progress/sitefinity-nextjs-sdk';

export function CustomContentListDetailsView(props: ViewPropsBase<ContentListEntity>) {
    // attributes are needed for the widget to be visible in edit mode
    const dataAttributes = props.attributes;

    // available in the view props via the widgetContext
    const sfDetailViewName = props.widgetContext.model.Properties.SfDetailViewName;

    return (
        <div {...dataAttributes}>
            <h1>Extended details view for the content list</h1>
            <p>The detail view name is: {sfDetailViewName}</p>
        </div>
    );
}
```

Then, it should be added in the views for the widget. There are some views already provided out of the box (content list views, content list detail views etc.), so your custom view can be either added to them or it can replace them. Either way, the detail view name must be prefixed with `'Details.'` :
```tsx
import { initRegistry, defaultWidgetRegistry } from '@progress/sitefinity-nextjs-sdk';

defaultWidgetRegistry.widgets['SitefinityContentList'].views!['Details.CustomContentListDetailsView'] = {
    Title: 'Custom content list details view',
    ViewFunction: CustomContentListDetailsView
};

export const widgetRegistry: WidgetRegistry = initRegistry(defaultWidgetRegistry);
```
### The _views_ property of the widget metadata
The views property can be used to add custom views or detail views to widgets. In order to use it, the widget's entity class should have one of two properties called `SfViewName` (used for the widget's view) and `SfDetailViewName` (Used for the detail view of a widget (Content list and Document list have it)). Both these properties should be marked with the decorator `@DataType('viewSelector')` and should be strings.

For example:
```tsx
import { WidgetEntity, DisplayName, DataType } from '@progress/sitefinity-widget-designers-sdk';

@WidgetEntity('CustomWidget', 'Custom widget')
export class CustomWidgetEntity {
    @DisplayName('Widget view')
    @DataType('viewSelector')
    SfViewName: string;

    @DisplayName('Details view')
    @DataType('viewSelector')
    SfDetailViewName: string;
}
```

_Views_ property can have one of the two following structures:
  - object that has the _**unique**_ name (which will be visualized in the widget editor) of the view as a key and the reference to the component function as value
  - object that has the _**unique**_ name of the view as a key and another object that has a friendly title as 'Title' property (which will be visualized in the widget editor) and the reference to the component function as 'ViewFunction' property

The naming convention for the  _**unique**_ name is: Everything that starts with `'Details.'` is considered as a view that will be rendered for the details view and everything else is for the widget view.

For example:
```tsx
const customWidgetRegistry: WidgetRegistry = {
    widgets: {
        '...': { // The name of the widget
            componentType: ..., // The component function
            entity: ..., // registration of the designer
            editorMetadata: {...} // metadata to be displayed in the WYSIWYG edotir - title, available operation, empty content visuals etc.
            ssr: ..., // whether this is a server rendered or client rendered component
            views: {
                'ViewWithNameOnly': CustomView,
                'Details.DetailsViewWithNameOnly': CustomDetailsView,
                'ViewWithNameAndFriendlyTitle': {
                    Title: 'View with name and friendly title',
                    VoewFunction: CustomView
                },
                'Details.DetailsViewWithNameAndFriendlyTitle': {
                    Title: 'Details view with name and friendly title',
                    ViewFunction: CustomDetailsView
                }
            }
        }
    }
};
```
#### RenderView component
You can create your own view logic based on the selected view name in the widget designer by taking advantage of the [RenderView](https://github.com/Sitefinity/nextjs-sdk/blob/main/widgets/common/render-view.tsx) component. It is designed to read the widget registry and take the metadata for the widget based on the `widgetKey` and `viewName` parameters. If a match is found in the registry, it will render that view otherwise it renders the `children` of the RenderView.

About the RenderView API usage, refer to the following [example of a custom widget view](https://github.com/Sitefinity/nextjs-samples/tree/main/src/widget-view).

### Widget personalization operaiton
Every custom widget that is created will have the personalization operation available in the page editor by default. That can be turned off by setting a flag in the editor metadata when registering the widget in the widget registry:

```tsx
const customWidgetRegistry: WidgetRegistry = {
    widgets: {
        '...': { // The name of the widget
            componentType: ..., // The component function
            entity: ..., // registration of the designer
            editorMetadata: {
                Title: '...',
                WidgetBehavior: {
                    NotPersonalizable: true // this will make the widget non-personalizable
                }
            } // metadata to be displayed in the WYSIWYG edotir - title, available operation, empty content visuals etc.
            ssr: ... // whether this is a server rendered or client rendered component
        }
    }
};
```

### Other tooling

#### HTML sanitization

@progress/sitefinity-nextjs-sdk provides _SanitizerService.getInstance().sanitizeHtml(html, config?)_ static method that uses server side and client side [DomPurify](https://www.npmjs.com/package/isomorphic-dompurify). The default configuration allows for some additional tags and attributes and could be overridden via _SanitizerService.getInstance().configure(config)_ where the configuration object is a partial implementation of the DomPurify [configuration format](https://github.com/cure53/DOMPurify/blob/main/README.md#can-i-configure-dompurify).
