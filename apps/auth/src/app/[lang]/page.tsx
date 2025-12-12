import { redirect } from 'next/navigation';
import { PageLangParam } from '@/libs/initLingui';

export default async function RootPage(props: PageLangParam) {
  const lang = (await props.params).lang;
  redirect(`/${lang}/sign-in`);
}
