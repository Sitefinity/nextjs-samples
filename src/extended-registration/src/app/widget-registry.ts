import { WidgetRegistry, initRegistry, defaultWidgetRegistry } from '@progress/sitefinity-nextjs-sdk';
import { RegistrationCaptchaV2View } from './widgets/registration-captcha-v2/registration-captcha-v2.view';
import { RegistrationCaptchaV3View } from './widgets/registration-captcha-v3/registration-captcha-v3.view';

const sitefinityRegistration = defaultWidgetRegistry.widgets['SitefinityRegistration'];

sitefinityRegistration.views = sitefinityRegistration.views ?? {};

sitefinityRegistration.views['RegistrationCaptchaV2'] = RegistrationCaptchaV2View;
sitefinityRegistration.views['RegistrationCaptchaV3'] = RegistrationCaptchaV3View;

export const widgetRegistry: WidgetRegistry = initRegistry(defaultWidgetRegistry);
