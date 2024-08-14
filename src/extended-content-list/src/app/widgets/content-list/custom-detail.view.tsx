import React from 'react';
import { SanitizerService } from '@progress/sitefinity-nextjs-sdk';
import { ContentListDetailViewProps } from '@progress/sitefinity-nextjs-sdk/widgets';
import { ExtendedContentListEntity } from './extended-content-list.entity';

export function CustomDetailView(props: ContentListDetailViewProps<ExtendedContentListEntity>) {
    return (
      <div>
        <h3>
          <span>{SanitizerService.getInstance().sanitizeHtml(props.detailItem?.Title) as string}</span>
        </h3>
      </div>
    );
}
