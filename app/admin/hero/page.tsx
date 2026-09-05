import { redirect } from 'next/navigation'

export default function HeroRedirect() {
  redirect('/admin/settings?tab=hero')
}
