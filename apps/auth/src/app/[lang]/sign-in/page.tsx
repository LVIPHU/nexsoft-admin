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
            <Trans>Login to your account</Trans>
          </h2>
          <p className='text-muted-foreground text-sm'>
            <Trans>Monitor and manageAccess your dashboard and manage your system your gas metrics and transactions</Trans>.
          </p>
        </div>
        <SignInForm redirectUri={searchParams.redirect_uri} appId={searchParams.app_id} />
      </div>
    </>
  );
}
