'use server'

import { settingService } from '@/services/setting.service'
import { getAdminSession } from '@/lib/session'

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized')
  return session
}

export async function fetchAboutAction() {
  return settingService.getAbout()
}

export async function updateAboutAction(data: any) {
  const session = await checkAuth()
  return settingService.updateAbout({ ...data, updatedBy: session.userId })
}
