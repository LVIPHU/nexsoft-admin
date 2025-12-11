import '../global.css';
import { PropsWithChildren } from 'react';
import { PageLangParam } from '@/libs/initLingui';
import { Geist, Geist_Mono } from 'next/font/google';
import { localeIds } from '@nexsoft-admin/utils';
import { getI18nInstance } from '@/libs/i18n';
import { msg } from '@lingui/core/macro';
import { Metadata } from 'next';
import Provider from '@/providers';
import { Separator } from '@nexsoft-admin/ui/separator';
import { Trans } from '@lingui/react/macro';
import { LocaleSwitch } from '@/components/locale-switch';
import { ThemeSwitch } from '@/components/theme-switch';
import { Copyright } from '@/components/copyright';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export async function generateStaticParams() {
  return localeIds.map((lang) => ({ lang }));
}

export async function generateMetadata(props: PageLangParam): Promise<Metadata> {
  const i18n = getI18nInstance((await props.params).lang);

  return {
    title: i18n._(msg`TBC Auth`),
  };
}

export default async function RootLayout({ children, params }: PropsWithChildren<PageLangParam>) {
  const lang = (await params).lang;
  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}>
        <Provider params={params}>
          <main>
            <div className='grid h-dvh justify-center p-2 lg:grid-cols-2'>
              <div className='bg-primary relative order-2 hidden h-full rounded-3xl lg:flex'>
                <div className='text-primary-foreground absolute top-10 space-y-1 px-10'>
                  <h1 className='text-2xl font-medium'>TBC Admin</h1>
                  <p className='text-sm'>
                    <Trans>Design. Build. Launch. Repeat.</Trans>
                  </p>
                </div>

                <div className='absolute bottom-10 flex w-full justify-between px-10'>
                  <div className='text-primary-foreground flex-1 space-y-1'>
                    <h2 className='font-medium'>
                      <Trans>Ready to launch</Trans>?
                    </h2>
                    <p className='text-sm'>
                      <Trans>Clone the repo, install dependencies, and your dashboard is live in minutes</Trans>.
                    </p>
                  </div>
                  <Separator orientation='vertical' className='mx-3 !h-auto' />
                  <div className='text-primary-foreground flex-1 space-y-1'>
                    <h2 className='font-medium'>
                      <Trans>Need help?</Trans>
                    </h2>
                    <p className='text-sm'>
                      <Trans>
                        Check out the docs or open an issue on GitHub, community support is just a click away
                      </Trans>
                      .
                    </p>
                  </div>
                </div>
              </div>
              <div className='relative order-1 flex h-full'>
                {children}
                <div className='absolute bottom-5 flex w-full flex-col-reverse items-center justify-center gap-y-6 px-10 lg:flex-row lg:justify-between'>
                  <Copyright />
                  <div className='flex items-center gap-1 text-sm'>
                    <LocaleSwitch />
                    <ThemeSwitch />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </Provider>
      </body>
    </html>
  );
}
