export const languages = [
  {
    id: 'en',
    name: 'English',
    subname: 'English',
    editorCode: 'en',
    locale: 'en-US',
    currency: 'USD',
  },
  {
    id: 'vi',
    name: 'Vietnamese',
    subname: 'Tiếng Việt',
    editorCode: 'vi',
    locale: 'vi-VN',
    currency: 'VND',
  },
  {
    id: 'zh-Hans',
    name: 'Chinese (Simplified)',
    subname: '简体中文',
    editorCode: 'zh-Hans',
    locale: 'zh-CN',
    currency: 'CNY',
  },
  {
    id: 'zh-Hant',
    name: 'Chinese (Traditional)',
    subname: '繁體中文',
    editorCode: 'zh-Hant',
    locale: 'zh-TW',
    currency: 'TWD',
  },
] as const;

export type Language = (typeof languages)[number];
export type LanguageId = Language['id'];

export const defaultLanguage = languages[0].id;
export const localeIds: LanguageId[] = languages.map((l) => l.id);
