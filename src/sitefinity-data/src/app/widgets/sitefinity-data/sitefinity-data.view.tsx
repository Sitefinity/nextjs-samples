import React from 'react';
import { SdkItem } from '@progress/sitefinity-nextjs-sdk/rest-sdk';
import { SitefinityDataEntity } from './sitefinity-data.entity';
import { SitefinityDataViewProps } from './sitefinity-data.view-props';

export function SitefinityDataDefaultView(props: SitefinityDataViewProps<SitefinityDataEntity>) {
  return (
    <div {...props.attributes}>
      <h1>Sitefinity data: News items</h1>
      <div>
        <ul>
          {
            props.items.map((item: SdkItem, idx: number) => {
              const title = item['Title'];
              const summary = item['Summary'];

              if (props.widgetContext.model.Properties.ShowSummary && summary) {
                return (<li key={idx}>
                  <div>{title}</div>
                  <div><small>{summary}</small></div>
                </li>);
              }

              return (<li key={idx}>
                <div>{title}</div>
              </li>);
            })
          }
        </ul>
      </div>
    </div>
  );
}
