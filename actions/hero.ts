'use server'

import { settingService } from '@/services/setting.service'
import { getAdminSession } from '@/lib/session'

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized session. Please log in again.')
  return session
}

export async function fetchHeroAction() {
  try {
    return await settingService.getHero()
  } catch (error: any) {
    console.error('[fetchHeroAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to fetch hero settings', data: undefined }
  }
}

export async function updateHeroAction(data: any) {
  try {
    const session = await checkAuth()
    return await settingService.updateHero({ ...data, updatedBy: session.userId })
  } catch (error: any) {
    console.error('[updateHeroAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to update hero settings', data: undefined }
  }
}
