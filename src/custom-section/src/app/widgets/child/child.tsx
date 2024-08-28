import React from 'react';
import { WidgetContext, htmlAttributes } from '@progress/sitefinity-nextjs-sdk';

export async function Child(props: WidgetContext<any>) {
    const dataAttributes = htmlAttributes(props);
    return (<div {...dataAttributes}>
      {/*FromParent property is populated in the StaticSection widget*/}
      {props.model.Properties.FromParent && <h2>{props.model.Properties.FromParent}</h2>}
    </div>);
}
