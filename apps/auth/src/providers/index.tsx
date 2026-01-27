import { PropsWithChildren } from 'react';
import { Toaster } from 'sonner';
import { allMessages } from '@/libs/i18n';
import { initLingui, PageLangParam } from '@/libs/initLingui';
import LocaleProvider from './locale.provider';
import ThemeProvider from './theme.provider';

export default async function Provider({ children, params }: Readonly<PropsWithChildren<PageLangParam>>) {
  const lang = (await params).lang;
  initLingui(lang);

  return (
    <LocaleProvider initialLocale={lang} initialMessages={allMessages[lang]!}>
      <ThemeProvider attribute='class' defaultTheme='dark' enableColorScheme enableSystem disableTransitionOnChange>
        {children}
        <Toaster />
      </ThemeProvider>
    </LocaleProvider>
  );
}
