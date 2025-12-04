import '../global.css';
import { PropsWithChildren } from 'react';
import { PageLangParam } from '@/libs/initLingui';
import { Geist, Geist_Mono } from 'next/font/google'
import {localeIds} from '@nexsoft-admin/utils'
import { getI18nInstance } from '@/libs/i18n';
import { msg } from '@lingui/core/macro'
import { Metadata } from 'next';
import Provider from '@/providers';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

export async function generateStaticParams() {
  return localeIds.map((lang) => ({ lang }))
}

export async function generateMetadata(props: PageLangParam): Promise<Metadata> {
  const i18n = getI18nInstance((await props.params).lang)

  return {
    title: i18n._(msg`TBC Auth`),
  }
}

export default async function RootLayout({ children, params }: PropsWithChildren<PageLangParam>) {
  const lang = (await params).lang
  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}>
       <Provider params={params}>{children}</Provider>
      </body>
    </html>
  );
}
