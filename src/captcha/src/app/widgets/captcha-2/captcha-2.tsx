import { htmlAttributes } from '@progress/sitefinity-nextjs-sdk';
import { WidgetContext } from '@progress/sitefinity-nextjs-sdk';
import { Captcha2Client } from './captcha-2-client';
import Script from 'next/script';
import React from 'react';

export async function Captcha2(props: WidgetContext<any>) {
    const dataAttributes = htmlAttributes(props);

    return (<div {...dataAttributes}>
      <Script
        src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit"
        section-name="Bottom"
        strategy={'lazyOnload'}
      />
      <Captcha2Client context={props.requestContext}
        siteKey={process.env.RECAPTCHA_SITE_KEY || ''} />
    </div>);
}
