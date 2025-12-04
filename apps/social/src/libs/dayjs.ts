import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)
dayjs.extend(timezone)
dayjs.extend(utc)

/**
 * Map Lingui locale IDs to dayjs locale loaders
 * Keys must match LocaleId type from language.constants.ts
 */
export const dayjsLocales: Record<string, () => Promise<ILocale>> = {
  en: async () => await import('dayjs/locale/en'),
  vi: async () => await import('dayjs/locale/vi'),
  'zh-Hans': async () => await import('dayjs/locale/zh-cn'),
  'zh-Hant': async () => await import('dayjs/locale/zh-tw'),
}
