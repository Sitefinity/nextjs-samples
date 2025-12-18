import { RequestContext } from '@progress/sitefinity-nextjs-sdk';
import { JSX, ReactNode } from 'react';
import { ScriptInjectorBodyTop, ScriptInjectorBodyBottom } from '../widgets/script/script-injector';

export function SitefinityTemplate({ widgets, requestContext }: {
    widgets: { [key: string]: ReactNode[] };
    requestContext: RequestContext;
}): JSX.Element {
    return (
      <>
        <ScriptInjectorBodyTop requestContext={requestContext} />
        <header data-sfcontainer="Header">
          {widgets['Header']}
        </header>
        <main data-sfcontainer="Content">
          {widgets['Content']}
        </main>
        <footer data-sfcontainer="Footer">
          {widgets['Footer']}
        </footer>
        <ScriptInjectorBodyBottom requestContext={requestContext} />
      </>
    );
}
