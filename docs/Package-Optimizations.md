# Tree-Shaking of Package content

Tree-shaking is a way to optimize the application by removing unused code from the final webpack bundle, which can significantly reduce the size of JavaScript files served and evaluated, expecially on the front end.

## How to Enable Tree-Shaking

Next.js, by default, supports tree-shaking for ES6 modules for some of its OOB packages. For additional packages (such as this one) it needs to be explicitly enabled.

### Changes to `next.config.js`

In the `next.config.js` file, add the [_optimizePackageImports_](https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports) flag. Have in mind that this flag is still under experimental and should be regarded as such.

```javascript
{
    // ...
    experimental: {
        // ...
        optimizePackageImports: ['@progress/sitefinity-nextjs-sdk']
    }
}
```

### Use ES6 Module Syntax with submodule imports

Ensure that you are using ES6 module syntax (`import`) in your widgets implementation code. In case you don't use all of our OOB widgets, you can import widget by widget what you are using in the registry and remove the general import.

In the case that you use only the `Content Block` of our widgets for example:
```ts
import { WidgetRegistry, defaultWidgetRegistry } from '@progress/sitefinity-nextjs-sdk';

const contentBlockMetadata = defaultWidgetRegistry.widgets['SitefinityContentBlock']

export const widgetRegistry: WidgetRegistry = = {
    widgets: {
        // ... custom widgets
        SitefinityContentBlock: contentBlockMetadata
    }
};
```
It could be done importing only its submodule, which will leave the large `@progress/sitefinity-nextjs-sdk/widgets` module and all the `@progress/sitefinity-nextjs-sdk/widgets/\<widget-name\>` submodules to be tree-shaken.

```ts
import { WidgetRegistry } from '@progress/sitefinity-nextjs-sdk';
import { ContentBlock, ContentBlockEntity } from '@progress/sitefinity-nextjs-sdk/widgets/content-block';

const contentBlockMetadata = {
    entity: ContentBlockEntity,
    componentType: ContentBlock,
    editorMetadata: {
        Title: 'Content block',
        Category: 'Content',
        Section: 'Basic',
        HasQuickEditOperation: true,
        IconName: 'content-block'
    },
    ssr: true
}

export const widgetRegistry: WidgetRegistry = = {
    widgets: {
        // ... custom widgets
        SitefinityContentBlock: contentBlockMetadata
    }
};
```

You can refer to the default values for each widget in the [source of the package](https://github.com/Sitefinity/nextjs-sdk).

### Analysis and additional reading

For additional Next.JS-specific information regarding package bundling, optimization and analysis, please refer to the [official Next.JS documentation](https://nextjs.org/docs/app/building-your-application/optimizing/package-bundling).
