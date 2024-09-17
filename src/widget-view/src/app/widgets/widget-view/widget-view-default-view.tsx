import { ViewPropsBase } from '@progress/sitefinity-nextjs-sdk/widgets';
import { WidgetViewEntity } from './widget-view-entity';

export function WidgetViewDefaultView(props: ViewPropsBase<WidgetViewEntity>) {
    return (<div {...props.attributes}>
      <h1>Default view for the widget view</h1>
    </div>);
}
