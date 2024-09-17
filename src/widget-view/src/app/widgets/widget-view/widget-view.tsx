import { WidgetContext, htmlAttributes, getMinimumWidgetContext } from '@progress/sitefinity-nextjs-sdk';
import { RenderView, ViewPropsBase } from '@progress/sitefinity-nextjs-sdk/widgets';
import { WidgetViewEntity } from './widget-view-entity';
import { WidgetViewDefaultView } from './widget-view-default-view';

export function WidgetView(props: WidgetContext<WidgetViewEntity>) {
    const entity = props.model.Properties;

    const viewProps: ViewPropsBase<WidgetViewEntity> = {
        attributes: htmlAttributes(props), // attributes are needed for the widget to be visible in edit mode
        widgetContext: getMinimumWidgetContext(props) // this function makes sure that the information is react-safe for transfer between SSR and CSR components
    };

    return (
      <RenderView
        viewName={entity.SfViewName} // Automatically populated from the widget designer. The name of the selected custom view registered in the 'views' property in the widget registry
        widgetKey={props.model.Name} // the name of the widget as registered in the widget registry. In this case 'WidgetView'
        viewProps={viewProps}> {/*viewProps can be any type inheriting the ViewPropsBase*/}
        <WidgetViewDefaultView {...viewProps} /> {/*the default view that will be rendered if no view with the provided SfViewName is found */}
      </RenderView>
    );
}
