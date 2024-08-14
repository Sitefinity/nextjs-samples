import { TemplateRegistry, defaultTemplateRegistry } from '@progress/sitefinity-nextjs-sdk';

let customTemplateRegistry: TemplateRegistry = {
    // 'CustomTemplate': {
    //     title: "Custom NextJS template",
    //     templateFunction: CustomTemplate
    // }
};

customTemplateRegistry = {
    ...defaultTemplateRegistry,
    ...customTemplateRegistry
};

export const templateRegistry: TemplateRegistry = customTemplateRegistry;
