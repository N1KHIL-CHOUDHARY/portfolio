'use server'

import { settingService } from '@/services/setting.service'
import { getAdminSession } from '@/lib/session'

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized')
  return session
}

export async function fetchHeroAction() {
  return settingService.getHero()
}

export async function updateHeroAction(data: any) {
  const session = await checkAuth()
  return settingService.updateHero({ ...data, updatedBy: session.userId })
}
