'use server'

import { settingService } from '@/services/setting.service'
import { getAdminSession } from '@/lib/session'

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized')
  return session
}

export async function fetchSeoAction() {
  return settingService.getSeo()
}

export async function updateSeoAction(data: any) {
  const session = await checkAuth()
  return settingService.updateSeo({ ...data, updatedBy: session.userId })
}
