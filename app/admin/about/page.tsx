import { redirect } from 'next/navigation'

export default function AboutRedirect() {
  redirect('/admin/settings?tab=about')
}
