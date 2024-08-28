import React from 'react';
import { StaticSectionEntity } from './static-section.entity';
import { ViewPropsBase } from '@progress/sitefinity-nextjs-sdk/widgets';
import { RenderWidgetService } from '@progress/sitefinity-nextjs-sdk';

export function ContainerView(props: ViewPropsBase<StaticSectionEntity>) {
    return (
      <div {...props.attributes} >
        <div className="container" data-sfcontainer={true}>
          {props.widgetContext.model.Children.map(x => {
                    return RenderWidgetService.createComponent(x, props.widgetContext.requestContext);
                })}
        </div>
      </div>
    );
}
