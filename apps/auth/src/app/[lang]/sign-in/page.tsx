import Link from 'next/link';
import { SignInForm } from '../_components/sign-in-form';
import { Trans } from '@lingui/react/macro';
import { initLingui, PageLangParam } from '@/libs/initLingui';

interface SignInPageProps extends PageLangParam {
  searchParams: Promise<{ redirect_uri?: string; app_id?: string }>;
}

export default async function SignInPage(props: SignInPageProps) {
  const lang = (await props.params).lang;
  const searchParams = await props.searchParams;
  initLingui(lang);

  return (
    <>
      <div className='mx-auto flex w-full flex-col justify-center space-y-8 sm:w-sm'>
        <div className='space-y-2 text-center'>
          <h2 className='text-3xl font-medium'>
            <Trans>Sign in to your account</Trans>
          </h2>
          <p className='text-muted-foreground text-sm'>
            <Trans>Please enter your details to sign in</Trans>.
          </p>
        </div>
        <SignInForm redirectUri={searchParams.redirect_uri} appId={searchParams.app_id} />
      </div>

      <div className='absolute top-5 flex w-full justify-center px-6 lg:justify-end lg:px-10'>
        <div className='text-muted-foreground text-sm'>
          <Trans>Don&apos;t have an account</Trans>?{' '}
          <Link className='text-foreground' href='/sign-up' aria-label='Sign up for an account'>
            <Trans>Sign Up</Trans>
          </Link>
        </div>
      </div>
    </>
  );
}
