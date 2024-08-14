
import React from 'react';
import { ExtendedContentBlockEntity } from './extended-content-block.entity';
import { WidgetContext } from '@progress/sitefinity-nextjs-sdk';
import { ContentBlock } from '@progress/sitefinity-nextjs-sdk/widgets';

export async function ExtendedContentBlock(props: WidgetContext<ExtendedContentBlockEntity>) {
    if (props.model.Properties.Content) {
        props.model.Properties.Content += props.model.Properties.TextToAppend;
    } else {
        props.model.Properties.Content = props.model.Properties.TextToAppend;
    }

    return <ContentBlock {...props}/>;
}
