# Registration widget templates with Captcha for NextJS Renderer

## Overview

The sample holds two templates for the registration widget - [registration-captcha-v2](./src/app/widgets/registration-captcha-v2/registration-captcha-v2.view.tsx) and[registration-captcha-v3](./src/app/widgets/registration-captcha-v3/registration-captcha-v3.view.tsx).

>**PREREQUISITES**: Before using Google reCAPTCHA, you must:
- Register your site get an API key pair at [Google reCAPTCHA](http://www.google.com/recaptcha/admin).You can generate an API key for either reCAPTCHA v2 or reCAPTCHA v3 and then use it with the corresponding widget from this sample.
- You must update your privacy and GDPR statements according to Google reCAPTCHA policies

## Project setup
To setup the project follow the instructions [here](./../../README.md#project-setup).

## Configure Sitefinity CMS

Before running the sample widgets, you must configure Sitefinity CMS.
Perform the following:

1. In Sitefinity backend, navigate to Administration » Settings » Advanced.
2. In the treeview, expand WebSecurity » Captcha and click Parameters.
3. Create the following parameters:
    - Key **VerificationUrl** and Value **https://www.google.com/recaptcha/api/siteverify**
    - Key **SecretKey** and Value **<The secret from the API key pair that you have created>**
    - Key **EnableRegistrationCaptchaValidation** and Value **true**

>**NOTE**: The version of the reCAPTCHA configuration for the secret key must correspond to the version of the reCAPTCHA widget that you are creating.

4. Save your changes

## Configure Next.js renderer

1. Open **.env.development** or **.env.production** (depending on the environment you are working on) and add the following variable:
**NEXT_PUBLIC_RECAPTCHA_SITE_KEY**=**<The site key from the API key pair that you have created>**

2. Open **next.config.js** and add the following values to the **cspHeader**:
- In the **script-src** section add: **https://www.google.com/recaptcha/api.js https://www.gstatic.com**
- Add new section **frame-src https://www.google.com;**
