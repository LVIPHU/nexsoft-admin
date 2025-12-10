import Link from "next/link";
import { Globe } from "lucide-react";
import SignUpForm from "../_components/sign-up-form";
import { Trans } from '@lingui/react/macro';
import { initLingui, PageLangParam } from '@/libs/initLingui';

export default async function SignUpPage(props: PageLangParam) {
  const lang = (await props.params).lang
  initLingui(lang)

  return (
    <>
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-medium"><Trans>Create your account</Trans></h1>
          <p className="text-muted-foreground text-sm"><Trans>Please enter your details to register.</Trans></p>
        </div>
        <SignUpForm />
      </div>

      <div className="absolute top-5 flex w-full justify-end px-10">
        <div className="text-muted-foreground text-sm">
          <Trans>Already have an account?</Trans>{" "}
          <Link className="text-foreground" href="/sign-in" aria-label="Sign in to your account">
            <Trans> Sign In </Trans>
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
  );
}
