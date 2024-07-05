import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './dictionaries/en.json';
import de from './dictionaries/de.json';
import bg from './dictionaries/bg.json';

const resources = {
  en: { translation: en },
  de: { translation: de },
  bg: { translation: bg }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    }
  });

export default i18n;
