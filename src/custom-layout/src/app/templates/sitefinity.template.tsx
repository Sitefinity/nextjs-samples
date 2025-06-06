import React, { JSX } from 'react';
import { ReactNode } from 'react';
import { RequestContext } from '@progress/sitefinity-nextjs-sdk';

export function SitefinityTemplate({ widgets, requestContext}: { widgets: { [key: string]: ReactNode[] }; requestContext: RequestContext; }): JSX.Element {
    return (
      <>
        <header data-sfcontainer="Header">
          {widgets['Header']}
        </header>
        <main data-sfcontainer="Content">
          {widgets['Content']}
        </main>
        <footer data-sfcontainer="Footer">
          {widgets['Footer']}
        </footer>
      </>
    );
}
