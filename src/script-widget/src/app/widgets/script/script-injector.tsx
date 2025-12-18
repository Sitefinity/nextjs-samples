import React from 'react';
import { WidgetModel } from '@progress/sitefinity-nextjs-sdk';
import { RequestContext } from '@progress/sitefinity-nextjs-sdk';
import { ScriptLocation, ScriptLocationType } from './script-location';

interface ScriptInjectorProps {
  requestContext: RequestContext;
}

// Helper function to flatten nested widget hierarchy
function flattenWidgets(widgets: WidgetModel[]): WidgetModel[] {
  return widgets.reduce((acc: WidgetModel[], widget: WidgetModel): WidgetModel[] => {
    if (Array.isArray(widget?.Children) && widget.Children.length) {
      return acc.concat(flattenWidgets(widget.Children));
    }

    return acc.concat([widget]);
  }, []);
}

// Helper function to filter and render scripts by location
function renderScriptsByLocation(requestContext: RequestContext, location: ScriptLocationType) {
  // Don't render scripts in edit mode
  if (requestContext.isEdit) {
    return null;
  }

  const allWidgets = flattenWidgets(requestContext.layout.ComponentContext.Components || []);

  const scripts = allWidgets
    .filter(widget => widget.Name === 'Script')
    .filter(widget => {
      const widgetLocation = widget.Properties?.Location || ScriptLocation.Inline;
      return widgetLocation === location;
    });

  if (scripts.length === 0) {
    return null;
  }

  return (
    <>
      {scripts.map((widget) => {
        const scriptId = `script-${widget.PlaceHolder}-${location}-${widget.Id}`;
        const content = widget.Properties?.Script || '';

        return (
          <div
            key={scriptId}
            id={scriptId}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        );
      })}
    </>
  );
}

export function ScriptInjectorBodyTop({ requestContext }: ScriptInjectorProps) {
  return renderScriptsByLocation(requestContext, ScriptLocation.BodyTop);
}

export function ScriptInjectorBodyBottom({ requestContext }: ScriptInjectorProps) {
  return renderScriptsByLocation(requestContext, ScriptLocation.BodyBottom);
}
