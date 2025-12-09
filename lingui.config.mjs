/** @type {import('@lingui/conf').LinguiConfig} */
export default {
  format: 'po',
  sourceLocale: 'en',
  fallbackLocales: { default: 'en' },
  locales: ['en', 'vi', 'zh-Hans', 'zh-Hant'],
  // Base config - catalogs will be overridden by individual apps
  catalogs: [],
};
