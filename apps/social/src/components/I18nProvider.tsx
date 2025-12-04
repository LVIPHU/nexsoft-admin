import { I18nProvider as LinguiI18nProvider } from '@lingui/react'
import { i18n } from '@lingui/core'
import { ReactNode, useEffect, useState } from 'react'
import { activateLocale } from '../i18n'

type I18nProviderProps = {
  children: ReactNode
  locale?: string
}

export function I18nProvider({ children, locale = 'en' }: I18nProviderProps) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    activateLocale(locale).then(() => {
      setIsReady(true)
    })
  }, [locale])

  if (!isReady) {
    return null // or a loading spinner
  }

  return (
    <LinguiI18nProvider i18n={i18n}>
      {children}
    </LinguiI18nProvider>
  )
}

