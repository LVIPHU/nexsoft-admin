import '@/packages/libs/dayjs'

import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { useEffect } from 'react'

import { LanguageId } from '@nexsoft-admin/utils';

type Props = {
  children: React.ReactNode
}

export const LocaleProvider = ({ children }: Props) => {
  // const userLocale = useAuthStore(
  //   (state) => state.profile?.locale ?? defaultLanguage,
  // )

  useEffect(() => {
    async function activateLocale() {
      // const detectedLocale =
      //   detect(
      //     fromUrl('locale'),
      //     fromStorage('locale'),
      //     userLocale,
      //     defaultLanguage,
      //   ) ?? defaultLanguage

      // Activate the locale only if it's supported
      // const localeToActivate = languages.some(
      //   (lang) => lang.id === detectedLocale,
      // )
      //   ? detectedLocale
      //   : defaultLanguage

      try {
        // await dynamicActivate(localeToActivate)
        // await configureZodLocale(localeToActivate)
      } catch (error) {
        console.error('Failed to activate locale:', error)
        // Fallback to default locale
        try {
          // await dynamicActivate(defaultLanguage)
          // await configureZodLocale(defaultLanguage)
        } catch (fallbackError) {
          console.error('Failed to activate default locale:', fallbackError)
        }
      }
    }

    void activateLocale()
  }, [])

  // i18n is already initialized in main.tsx, so I18nProvider can render immediately
  return <I18nProvider i18n={i18n}>{children}</I18nProvider>
}

export const changeLanguage = (locale: LanguageId) => {
  // Update locale in local storage
  window.localStorage.setItem('locale', locale)

  // Update locale in user profile, if authenticated
  // const state = useAuthStore.getState()
  // if (state.profile) state.setProfile({ ...state.profile, locale })

  // Reload the page for language switch to take effect
  window.location.reload()
}
