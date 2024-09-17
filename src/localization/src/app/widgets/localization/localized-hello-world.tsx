import React from 'react';
import { WidgetContext, htmlAttributes } from '@progress/sitefinity-nextjs-sdk';
import { LocalizedHelloWorldEntity } from './localized-hello-world.entity';
import { getDictionary } from './dictionaries';

export async function LocalizedHelloWorld(props: WidgetContext<LocalizedHelloWorldEntity>) {

    // attributes are needed for the widget to be visible in edit mode
    const dataAttributes = htmlAttributes(props);

    // get dictionary for the requested culture
    const dict = await getDictionary(props.requestContext.culture);

    return (
      <div {...dataAttributes}>
        <h1>{dict.message}</h1>
        <h1>{props.model.Properties.Content}</h1>
      </div>
    );
}
