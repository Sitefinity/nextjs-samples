const dictionaries: any = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  bg: () => import('./dictionaries/bg.json').then((module) => module.default),
  de: () => import('./dictionaries/de.json').then((module) => module.default)
};

export const getDictionary = async (locale: any) => dictionaries[locale]();
