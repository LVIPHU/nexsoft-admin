import Link from 'next/link';
import { SignUpForm } from '../_components/sign-up-form';
import { Trans } from '@lingui/react/macro';
import { initLingui, PageLangParam } from '@/libs/initLingui';

export default async function SignUpPage(props: PageLangParam) {
  const lang = (await props.params).lang;
  initLingui(lang);

  return (
    <>
      <div className='mx-auto flex w-full flex-col justify-center space-y-8 sm:w-sm'>
        <div className='space-y-2 text-center'>
          <h2 className='text-3xl font-medium'>
            <Trans>Create your account</Trans>
          </h2>
          <p className='text-muted-foreground text-sm'>
            <Trans>Please enter your details to sign up</Trans>.
          </p>
        </div>
        <SignUpForm />
      </div>

      <div className='absolute top-5 flex w-full justify-center px-6 lg:justify-end lg:px-10'>
        <div className='text-muted-foreground text-sm'>
          <Trans>Already have an account</Trans>?{' '}
          <Link className='text-foreground' href='/sign-in' aria-label='Sign in to your account'>
            <Trans>Sign In</Trans>
          </Link>
        </div>
      </div>
    </>
  );
}
