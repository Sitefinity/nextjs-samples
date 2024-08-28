import { TemplateRegistry, defaultTemplateRegistry } from '@progress/sitefinity-nextjs-sdk';
import { SitefinityTemplate } from './templates/sitefinity.template';

let customTemplateRegistry: TemplateRegistry = {
    'SitefinityTemplate': {
        title: 'Custom NextJS template',
        templateFunction: SitefinityTemplate
    }
};

customTemplateRegistry = {
    ...defaultTemplateRegistry,
    ...customTemplateRegistry
};

export const templateRegistry: TemplateRegistry = customTemplateRegistry;
