import React from 'react';
import { OpenDetailsAnchor, ContentListMasterViewProps } from '@progress/sitefinity-nextjs-sdk/widgets';
import { SanitizerService } from '@progress/sitefinity-nextjs-sdk';
import { SdkItem } from '@progress/sitefinity-nextjs-sdk/rest-sdk';
import { ExtendedContentListEntity } from './extended-content-list.entity';

export interface CardsListModelCustomProps<T extends ExtendedContentListEntity> extends ContentListMasterViewProps<T> {
    items: Array<CardItemModelCustom>
}

export interface CardItemModelCustom {
    Heading: {
        Value: string,
        Css: string
    },

    Original: SdkItem
}

export function CardsListCustomView(props: CardsListModelCustomProps<ExtendedContentListEntity>) {
    const items = props.items;

    const contentListAttributes = props.attributes;
    const classAttributeName = contentListAttributes['class'] ? 'class' : 'className';
    contentListAttributes[classAttributeName] += ' row row-cols-1 row-cols-md-3';
    contentListAttributes[classAttributeName] = contentListAttributes[classAttributeName].trim();

    return (
      <div {...contentListAttributes}>
        {items.map(item => {
                const title = SanitizerService.getInstance().sanitizeHtml(item.Heading?.Value);
                return (
                  <h3 key={item.Original.Id}>
                    <OpenDetailsAnchor
                      detailPageMode={props.widgetContext.model.Properties?.DetailPageMode!}
                      detailPageUrl={props.detailPageUrl}
                      requestContext={props.widgetContext.requestContext}
                      text={title as string}
                      item={item} />
                  </h3>
                );
        })}
      </div>
    );
}
