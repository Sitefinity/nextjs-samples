# Custom template sample

## Overview
The NextJS pages are based on templates that are stored in the Renderer application. These templates are React functional components, registered in the renderer app. If a page is based on one of them, the Renderer will be able to render the page.

Out-of-the-box Sitefinity NextJS Renderer comes with a blank template called Default that you can select in the template selector. This template references Bootstrap5 CSS framework. The default Section widget templates also contain the Bootstrap5 grid system markup.

## Project setup
To setup the project follow the instructions [here](./../../README.md#project-setup).

## How to create custom template
This sample demonstrates how to setup a custom template component that can be used as a base for building your NextJS application. The template is meant to contain the common HTML page structure like its head, body tags, common scripts and the styles for the page.

Template inheritance is available for custom templates as well. You can base your Sitefinity templates on the custom templates from the NextJS Renderer.

To create your own custom template, you must do the following:

1. Create a .tsx file that holds implementation of the template. The component accepts two arguments: **widgets** and **requestContext**.

2. The **widgets** property is a dictionary of **ReactNode** components that are ready to be rendered. The key of the dictionary is the name of the container where the widgets should be placed. The **requestContext** property is of type **RequestContext** and holds information about the current request.

3. To define your own custom sections, you can decorate several html tags (div, header, footer, aside, section, main, body) with the data-sfcontainer="your_placeholder_name" attribute, which will enable users to drop into different placeholders from scratch.

4. Register the custom template in the template registry. That way the templates are integrated in the backend UI of Sitefinity and you can choose between them when you create new page. To do this go to Sitefinity backend -> Pages-> Create a page, enter page title and click “Continue”. Your template files will be available at the top of the template selector under the section “External NextJS renderer”:

``` typescript
const customTemplateRegistry: TemplateRegistry = {
    'SitefinityTemplate': {
        title: "Custom NextJS template",
        templateFunction: SitefinityTemplate
    }
};
```
