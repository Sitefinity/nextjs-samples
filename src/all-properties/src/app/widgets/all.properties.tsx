import React from 'react';
import { WidgetContext, getMinimumWidgetContext, htmlAttributes } from '@progress/sitefinity-nextjs-sdk';
import { RenderView, ViewPropsBase } from '@progress/sitefinity-nextjs-sdk/widgets';
import { AllPropertiesEntity } from './all-properties.entity';
import { AllPropertiesDefaultView } from './all-properties.view';

export async function AllProperties(props: WidgetContext<AllPropertiesEntity>) {

    const dataAttributes = htmlAttributes(props);

    const viewProps: ViewPropsBase<AllPropertiesEntity> = {
        attributes: dataAttributes,
        widgetContext: getMinimumWidgetContext(props)
    };

    return (
      <RenderView
        viewName={'Default'}
        widgetKey={props.model.Name}
        viewProps={viewProps}>
        <AllPropertiesDefaultView {...viewProps} />
      </RenderView>
    );
}
