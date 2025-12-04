import { i18n } from '@lingui/core'

export async function loadCatalog(locale: string) {
  // Next.js can handle dynamic imports, but using switch for consistency
  let messages
  switch (locale) {
    case 'en':
      messages = (await import('./locales/en/messages.js')).default
      break
    case 'vi':
      messages = (await import('./locales/vi/messages.js')).default
      break
    default:
      messages = (await import('./locales/en/messages.js')).default
      break
  }
  return messages
}

export async function activateLocale(locale: string) {
  const messages = await loadCatalog(locale)
  i18n.load(locale, messages)
  i18n.activate(locale)
}


