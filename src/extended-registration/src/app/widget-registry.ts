import { WidgetRegistry, initRegistry, defaultWidgetRegistry, addWidgetViews } from '@progress/sitefinity-nextjs-sdk';
import { RegistrationCaptchaV2View } from './widgets/registration-captcha-v2/registration-captcha-v2.view';
import { RegistrationCaptchaV3View } from './widgets/registration-captcha-v3/registration-captcha-v3.view';

addWidgetViews(defaultWidgetRegistry, 'SitefinityRegistration', {'RegistrationCaptchaV2': RegistrationCaptchaV2View});
addWidgetViews(defaultWidgetRegistry, 'SitefinityRegistration', {'RegistrationCaptchaV3': RegistrationCaptchaV3View});

export const widgetRegistry: WidgetRegistry = initRegistry(defaultWidgetRegistry);
