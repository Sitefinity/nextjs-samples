import Script from 'next/script';
import { Captcha3Client } from './captcha-3-client';
import { getUniqueId, htmlAttributes, WidgetContext } from '@progress/sitefinity-nextjs-sdk';
import React from 'react';

export async function Captcha3(props: WidgetContext<any>) {
    const dataAttributes = htmlAttributes(props);
    const captchaId = getUniqueId('onCaptchaSubmit');
    return (<div {...dataAttributes}>
      <Script
        src={'https://www.google.com/recaptcha/api.js'}
        strategy={'lazyOnload'}
     />
      <Captcha3Client
        captchaId={captchaId}
        siteKey={process.env.RECAPTCHA_SECRET_INVISIBLE_KEY || ''} />
    </div>);
}
