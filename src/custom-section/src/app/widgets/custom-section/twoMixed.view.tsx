import React from 'react';
import { StaticSectionEntity } from './static-section.entity';
import { ViewPropsBase } from '@progress/sitefinity-nextjs-sdk/widgets';
import { RenderWidgetService } from '@progress/sitefinity-nextjs-sdk';

export function TwoMixedView(props: ViewPropsBase<StaticSectionEntity>) {
    const column = (containerName: string, className: string) => (
      <div className={className} data-sfcontainer={containerName}>
        {props.widgetContext.model.Children.filter(x => x.PlaceHolder === containerName).map(x => {
                    return RenderWidgetService.createComponent(x, props.widgetContext.requestContext);
                })}
      </div>
    );

    return (
      <section {...props.attributes} className="row" >
        {column('Column 1', 'col-4')}
        {column('Column 2', 'col')}
      </section>
    );
}
