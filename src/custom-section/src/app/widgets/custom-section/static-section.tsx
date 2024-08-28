import React from 'react';
import { StaticSectionEntity } from './static-section.entity';
import { WidgetContext, htmlAttributes } from '@progress/sitefinity-nextjs-sdk';
import { ViewPropsBase, RenderView } from '@progress/sitefinity-nextjs-sdk/widgets';
import { ContainerView } from './container.view';

export async function StaticSection(props: WidgetContext<StaticSectionEntity>) {
    const dataAttributes = htmlAttributes(props);
    props.model.Children.map(x => x.Properties['FromParent'] = 'Val from parent');
    const viewProps: ViewPropsBase<StaticSectionEntity> = {
        attributes: dataAttributes,
        widgetContext: props
    };

    return (
      <RenderView
        viewName={props.model.Properties.SfViewName}
        widgetKey={props.model.Name}
        viewProps={viewProps}>
        <ContainerView {...viewProps} />
      </RenderView>
    );
}
