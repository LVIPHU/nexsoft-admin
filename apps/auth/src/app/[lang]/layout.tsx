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
import Image from 'next/image';

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
            <div className='grid h-dvh justify-center p-2 lg:grid-cols-12'>
              <div className='relative hidden h-full rounded-3xl bg-[#00170A] lg:col-span-5 lg:flex'>
                <div className='absolute top-4 px-4'>
                  <Image src={'/TBChat-app-logo.svg'} alt={'logo'} width={40} height={40} />
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
              <div className='relative flex h-full lg:col-span-7'>{children}</div>
            </div>
          </main>
        </Provider>
      </body>
    </html>
  );
}
