import { redirect } from 'next/navigation'
import { defaultLanguage } from '@nexsoft-admin/utils'

// Redirect root to default language
export default function RootPage() {
  redirect(`/${defaultLanguage}`)
}
