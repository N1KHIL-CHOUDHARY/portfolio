import { redirect } from 'next/navigation'

export default function TrashRedirect() {
  redirect('/admin/projects?tab=TRASH')
}
