import { i18n } from '@lingui/core'
import dayjs from 'dayjs'

import { defaultLanguage } from '@nexsoft-admin/utils'

import { dayjsLocales } from './dayjs'

/**
 * Load messages for requested locale and activate it.
 * This function isn't part of the LinguiJS library because there are
 * many ways how to load messages — from REST API, from file, from cache, etc.
 */
export async function dynamicActivate(locale: string) {
  try {
    const { messages } = await import(`../../locales/${locale}/messages.po`)

    if (messages) {
      i18n.loadAndActivate({ locale, messages })
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (dayjsLocales[locale]) {
      dayjs.locale(await dayjsLocales[locale]())
    }
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error)
    throw new Error(`Failed to load messages for locale: ${locale}`)
  }
}

/**
 * Initialize Lingui with default locale (English)
 * This should be called before rendering the app to prevent I18nProvider warnings
 */
export async function initializeLingui() {
  await dynamicActivate(defaultLanguage)
}
