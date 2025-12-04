import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { languages, type LanguageId } from './languages'

// Dynamic import function for loading catalogs
export async function loadCatalog(locale: LanguageId) {
  // This will be replaced by lingui loader at build time
  const { messages } = await import(`../locales/${locale}/messages`)
  return messages
}

// Initialize i18n with default locale
export function setupI18n(locale: LanguageId = 'en') {
  i18n.loadLocaleData(locale, {})
  return i18n
}

// Get available locales
export function getAvailableLocales() {
  return languages.map((lang) => lang.id)
}

// Get locale from language ID
export function getLocaleFromLanguageId(languageId: LanguageId): string {
  const lang = languages.find((l) => l.id === languageId)
  return lang?.locale || 'en-US'
}

// Export I18nProvider for convenience
export { I18nProvider }


