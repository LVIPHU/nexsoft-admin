import { i18n } from '@lingui/core';
import { detect, fromStorage, fromUrl } from "@lingui/detect-locale";
import { I18nProvider } from '@lingui/react';
import { useEffect } from 'react';

import { defaultLanguage, languages, LanguageId } from '@nexsoft-admin/utils';
import { dynamicActivate } from '@/libs/lingui';

type Props = {
  children: React.ReactNode;
};

export const LocaleProvider = ({ children }: Props) => {

  useEffect(() => {


    async function activateLocale() {
      const detectedLocale =
        detect(
          fromUrl('locale'),
          fromStorage('locale'),
          defaultLanguage,
        ) ?? defaultLanguage

      // Activate the locale only if it's supported
      const localeToActivate = languages.some(
        (lang) => lang.id === detectedLocale,
      )
        ? detectedLocale
        : defaultLanguage

      try {
        await dynamicActivate(localeToActivate)
      } catch (error) {
        console.error('Failed to activate locale:', error);
        // Fallback to default locale
        try {
          await dynamicActivate(defaultLanguage)
        } catch (fallbackError) {
          console.error('Failed to activate default locale:', fallbackError);
        }
      }
    }

    void activateLocale();
  }, []);

  // i18n is already initialized in main.tsx, so I18nProvider can render immediately
  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
};

export const changeLanguage = (locale: LanguageId) => {
  // Update locale in local storage
  window.localStorage.setItem('locale', locale);

  // Reload the page for language switch to take effect
  window.location.reload();
};
