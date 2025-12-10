import Link from 'next/link';
import { Globe } from "lucide-react";
import SignInForm from '../_components/sign-in-form';
import { Trans } from '@lingui/react/macro';
import { initLingui, PageLangParam } from '@/libs/initLingui';

export default async function SignInPage(props: PageLangParam) {
  const lang = (await props.params).lang
  initLingui(lang)

  return (
    <>
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-medium"><Trans>Login to your account</Trans></h1>
          <p className="text-muted-foreground text-sm">Please enter your details to login.</p>
        </div>
        <SignInForm />
      </div>

      <div className="absolute top-5 flex w-full justify-end px-10">
        <div className="text-muted-foreground text-sm">
          Don&apos;t have an account?{" "}
          <Link className="text-foreground" href="/sign-up" aria-label="Sign up for an account">
            Sign Up
          </Link>
        </div>
      </div>

      <div className="absolute bottom-5 flex w-full justify-between px-10">
        <div className="text-sm">APP_CONFIG.copyright</div>
        <div className="flex items-center gap-1 text-sm">
          <Globe className="text-muted-foreground size-4" />
          ENG
        </div>
      </div>
    </>
  )
}
