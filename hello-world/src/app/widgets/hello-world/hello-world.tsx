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
