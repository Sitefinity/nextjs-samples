import React from 'react';
import { ReactNode } from 'react';
import { RequestContext } from '@progress/sitefinity-nextjs-sdk';

export function SitefinityTemplate({ widgets, requestContext}: { widgets: { [key: string]: ReactNode[] }; requestContext: RequestContext; }): JSX.Element {
    return (
      <>
        <header data-sfcontainer="Header">
          {widgets['Header']}
        </header>
        <header data-sfcontainer="Content">
          {widgets['Content']}
        </header>
        <header data-sfcontainer="Footer">
          {widgets['Footer']}
        </header>
      </>
    );
}
