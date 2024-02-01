'use client';

import React from 'react';
export function Captcha3Client(props: {captchaId: string, siteKey: string}) {
    const divRef = React.useRef<HTMLDivElement>(null);
    const addSubmitAttributes = React.useCallback(()=>{
        const form = divRef.current?.closest('form');
        const submitButton = form!.querySelector('[data-sf-role="submit-button-container"] button');
        if (submitButton) {
            const submitId = props.captchaId;
            (window as any)[submitId] = function () {
                form!.dispatchEvent(new Event('submit'));
            };
            submitButton.classList.add('g-recaptcha');
            submitButton.setAttribute('data-sitekey', props.siteKey);
            submitButton.setAttribute('data-callback', submitId);
        }
    },[props.captchaId, props.siteKey]);

    React.useEffect(()=>{
        addSubmitAttributes();
    },[addSubmitAttributes]);

    return (<div data-sf-role="captcha" ref={divRef} />);
}
