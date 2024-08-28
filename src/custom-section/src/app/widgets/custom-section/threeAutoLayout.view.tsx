import React from 'react';
import { StaticSectionEntity } from './static-section.entity';
import { ViewPropsBase } from '@progress/sitefinity-nextjs-sdk/widgets';
import { RenderWidgetService } from '@progress/sitefinity-nextjs-sdk';

export function ThreeAutoLayoutView(props: ViewPropsBase<StaticSectionEntity>) {
    const column = (containerName: string) => (
      <div className="col" data-sfcontainer={containerName}>
        {props.widgetContext.model.Children.filter(x => x.PlaceHolder === containerName).map(x => {
                    return RenderWidgetService.createComponent(x, props.widgetContext.requestContext);
                })}
      </div>
    );

    return (
      <section {...props.attributes} className="row" >
        {column('Column 1')}
        {column('Column 2')}
        {column('Column 3')}
      </section>
    );
}
