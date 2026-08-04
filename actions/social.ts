'use server'

import { settingService } from '@/services/setting.service'
import { getAdminSession } from '@/lib/session'

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized')
  return session
}

export async function fetchSocialsAction() {
  return settingService.getSocials()
}

export async function saveSocialAction(id: string | undefined, data: any) {
  const session = await checkAuth()
  return settingService.saveSocial(id, { ...data, createdBy: session.userId, updatedBy: session.userId })
}

export async function deleteSocialAction(id: string) {
  const session = await checkAuth()
  return settingService.deleteSocial(id, session.userId)
}
