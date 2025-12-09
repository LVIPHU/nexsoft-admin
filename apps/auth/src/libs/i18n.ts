import 'server-only';

import { I18n, Messages, setupI18n } from '@lingui/core';
import { localeIds, defaultLanguage } from '@nexsoft-admin/utils';

// Valid locale IDs only
type SupportedLocales = (typeof localeIds)[number];

async function loadCatalog(locale: SupportedLocales): Promise<{
  [k: string]: Messages;
}> {
  const { messages } = await import(`../locales/${locale}/messages.po`);
  return {
    [locale]: messages,
  };
}
const catalogs = await Promise.all(localeIds.map(loadCatalog));

// transform array of catalogs into a single object
export const allMessages = catalogs.reduce((acc, oneCatalog) => {
  return { ...acc, ...oneCatalog };
}, {});

type AllI18nInstances = { [K in SupportedLocales]: I18n };

export const allI18nInstances: AllI18nInstances = localeIds.reduce((acc, locale) => {
  const messages = allMessages[locale] ?? {};
  const i18n = setupI18n({
    locale,
    messages: { [locale]: messages },
  });
  return { ...acc, [locale]: i18n };
}, {} as AllI18nInstances);

export const getI18nInstance = (locale: string): I18n => {
  // Validate locale - only accept valid locale IDs
  const validLocale = localeIds.includes(locale as SupportedLocales) ? (locale as SupportedLocales) : defaultLanguage;

  // Only warn if locale was invalid (not if it's the default fallback)
  if (!localeIds.includes(locale as SupportedLocales) && locale !== defaultLanguage) {
    console.warn(`Invalid locale "${locale}", falling back to "${defaultLanguage}"`);
  }

  return allI18nInstances[validLocale] || allI18nInstances[defaultLanguage];
};
