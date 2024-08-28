import React from 'react';
import { ViewPropsBase } from '@progress/sitefinity-nextjs-sdk/widgets';
import { AllPropertiesEntity } from './all-properties.entity';

export function AllPropertiesDefaultView(props: ViewPropsBase<AllPropertiesEntity>) {
    return (
      <div {...props.attributes}>
        <div>{ JSON.stringify(props.widgetContext.model.Properties) } </div>
      </div>
    );
}
