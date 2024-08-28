import React from 'react';
import { WidgetContext, getMinimumWidgetContext, htmlAttributes } from '@progress/sitefinity-nextjs-sdk';
import { RestClient, RestSdkTypes } from '@progress/sitefinity-nextjs-sdk/rest-sdk';
import { RenderView } from '@progress/sitefinity-nextjs-sdk/widgets';
import { SitefinityDataEntity } from './sitefinity-data.entity';
import { SitefinityDataDefaultView } from './sitefinity-data.view';
import { SitefinityDataViewProps } from './sitefinity-data.view-props';

export async function SitefinityData(props: WidgetContext<SitefinityDataEntity>) {

    const dataAttributes = htmlAttributes(props);

    const newsItems = await RestClient.getItems({
        type: RestSdkTypes.News,
        take: props.model.Properties.ItemsCount
    });

    const viewProps: SitefinityDataViewProps<SitefinityDataEntity> = {
      widgetContext: getMinimumWidgetContext(props),
      attributes: dataAttributes,
      items: newsItems.Items
    };

    return (
      <RenderView
        viewName={props.model.Properties.SfViewName}
        widgetKey={props.model.Name}
        viewProps={viewProps}>
        <SitefinityDataDefaultView {...viewProps} />
      </RenderView>
    );
}
