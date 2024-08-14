import { ViewPropsBase } from '@progress/sitefinity-nextjs-sdk';
import { WidgetViewEntity } from '../widget-view-entity';

export function CustomViewExample(props: ViewPropsBase<WidgetViewEntity>) {
    return (<h1>Custom view for the widget view that overrides the default one</h1>);
}
