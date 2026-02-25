import '../global.css';
import { PropsWithChildren } from 'react';
import { PageLangParam } from '@/libs/initLingui';
import { Geist, Geist_Mono } from 'next/font/google';
import { cn, localeIds } from '@nexsoft-admin/utils';
import { getI18nInstance } from '@/libs/i18n';
import { msg } from '@lingui/core/macro';
import { Metadata } from 'next';
import Provider from '@/providers';
import Image from 'next/image';
import { InteractiveGridPattern } from '@/components/interactive-grid-pattern';
import { HoverCard } from '@/components/hover-card';
import { LightRaysBackground } from '@/components/light-rays-background';

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
                <LightRaysBackground />
                <div className='absolute top-4 px-4'>
                  <Image src={'/TBChat-app-logo.svg'} alt={'logo'} width={40} height={40} />
                </div>
                <InteractiveGridPattern
                  className={cn('[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]')}
                  width={100}
                  height={100}
                  squares={[8, 12]}
                />
                <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-13 p-4 sm:p-6 md:p-8 lg:p-10'>
                  <HoverCard className='pointer-events-auto'>
                    <div className='mx-auto w-fit max-w-full'>
                      <Image
                        src={'/screen.png'}
                        alt={'screen'}
                        width={482}
                        height={330}
                        priority
                        className='h-full max-h-full w-full object-center'
                      />
                    </div>
                  </HoverCard>

                  <div className='flex flex-col gap-2 px-4 text-center sm:px-6 md:px-8 lg:px-10'>
                    <p className='text-3xl font-semibold'>Secure, Simple and Powerful</p>
                    <p className='leading-4'>
                      Log in to manage data, monitor performance, and control your system in real time.
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
