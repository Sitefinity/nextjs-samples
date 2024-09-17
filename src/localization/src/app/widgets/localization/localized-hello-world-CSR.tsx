'use client';

import React from 'react';
import { WidgetContext, htmlAttributes } from '@progress/sitefinity-nextjs-sdk';
import { LocalizedHelloWorldEntityCSR } from './localized-hello-world-CSR.entity';

import i18n from './i18n';
import { Trans } from 'react-i18next';

export function LocalizedHelloWorldCSR(props: WidgetContext<LocalizedHelloWorldEntityCSR>) {

    /// attributes are needed for the widget to be visible in edit mode
    const dataAttributes = htmlAttributes(props);

    i18n.changeLanguage(props.requestContext.culture);

    return (
      <div {...dataAttributes}>
        <h1><Trans i18nKey="message" /></h1>
        <h1>{props.model.Properties.Content}</h1>
      </div>
    );
}
