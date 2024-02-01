'use client';

import React from 'react';
import { classNames } from '@progress/sitefinity-nextjs-sdk';
import { RequestContext } from '@progress/sitefinity-nextjs-sdk';

export function Captcha2Client(props: {context: RequestContext, siteKey: string}) {
    const renderCaptcha = React.useCallback(() => {
        (window as any).grecaptcha.render('captchav2', {
            'sitekey':props.siteKey
        });
    },[props.siteKey]);

    React.useEffect(()=>{
        (window as any).onloadCallback = renderCaptcha;
    },[renderCaptcha]);

    return (
      <div id="captchav2" className={classNames('mb-3',{
            'pe-none': props.context.isEdit
        })} />
    );
}
