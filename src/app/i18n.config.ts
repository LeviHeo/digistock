export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'zh-hant'],
  defaultNameSpace: 'common',
} as const;

export type Locale = (typeof i18n)['locales'][number];

export enum HrefLangType {
  'en' = 'en',
  'zh-hant' = 'zh-hant',
}
