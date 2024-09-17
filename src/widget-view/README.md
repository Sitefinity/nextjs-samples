# Widget view

This sample demonstrates how to create a custom widget that serves as a main view widget which can have it's default view overridden.
It utilizes the [RenderView](https://github.com/Sitefinity/nextjs-sdk/blob/main/widgets/common/render-view.tsx) component.

Properties that the RenderView requires:
 - widgetKey: The name of the widget
 - viewName: The name of the currently selected view (SfViewName), as defined in the `views` property in the widget registry
 - viewProps: [ViewPropsBase\<T>](https://github.com/Sitefinity/nextjs-sdk/blob/main/widgets/common/view-props-base.ts). It can be extended to include custom properties
 - children: A default implementation of a view that will be rendered if nothing is found in the `views` property with the provided `viewName`

## Project setup
To setup the project follow the instructions [here](./../../README.md#project-setup).
