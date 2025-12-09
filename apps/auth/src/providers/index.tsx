import { PropsWithChildren } from 'react';
import { Toaster } from 'sonner';
import { initLingui, PageLangParam } from '@/libs/initLingui';
import LocaleProvider from '@/providers/locale.provider';
import { allMessages } from '@/libs/i18n';

export default async function Provider({ children, params }: Readonly<PropsWithChildren<PageLangParam>>) {
  const lang = (await params).lang;
  initLingui(lang);
  return (
    <LocaleProvider initialLocale={lang} initialMessages={allMessages[lang]!}>
      {children}
      <Toaster />
    </LocaleProvider>
  );
}
