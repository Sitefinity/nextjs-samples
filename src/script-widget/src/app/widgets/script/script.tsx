import React from 'react';
import 'server-only';
import { WidgetContext, htmlAttributes } from '@progress/sitefinity-nextjs-sdk';
import { ScriptEntity } from './script.entity';
import { ScriptLocation } from './script-location';

export function Script(props: WidgetContext<ScriptEntity>) {
  const { model } = props;
  const entity = model.Properties;

  const location = entity.Location || ScriptLocation.Inline;
  const content = entity.Script || '';
  const scriptId = `script-${model.PlaceHolder}-${location}-${content}`;
  const dataAttributes = htmlAttributes(props);

  if (props.requestContext.isEdit) {
    const paragraphs = content && content.length ? content.split(/\r?\n/).slice(0, 3) : [];
    let scriptLocationString = '';
    if (content) {
      switch (location) {
        case ScriptLocation.Inline: scriptLocationString = 'Included where the widget is dropped.'; break;
        case ScriptLocation.BodyBottom: scriptLocationString = 'Included before the closing </body> tag.'; break;
        case ScriptLocation.BodyTop: scriptLocationString = 'Included after the opening <body> tag.'; break;
        default: break;
      }
    }

    return (
      <div {...dataAttributes}>
        {paragraphs.map((line, i) => (
          <React.Fragment key={i}>
            {line}<br />
          </React.Fragment>
        ))}
        {scriptLocationString && (
          <>
            ...<br />
            <i>{scriptLocationString}</i>
          </>
        )}
      </div>
    );
  }

  if (location === ScriptLocation.BodyBottom || location === ScriptLocation.BodyTop) {
    // BodyBottom and BodyTop scripts are handled by ScriptInjector components
    // which read them directly from the layout data
    return null;
  }

  return (
    <div
      className="script-widget"
      {...dataAttributes}
      id={scriptId + '-container'}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
