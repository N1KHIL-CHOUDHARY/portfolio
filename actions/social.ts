'use server'

import { settingService } from '@/services/setting.service'
import { getAdminSession } from '@/lib/session'

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized session. Please log in again.')
  return session
}

export async function fetchSocialsAction() {
  try {
    return await settingService.getSocials()
  } catch (error: any) {
    console.error('[fetchSocialsAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to fetch social links', items: [] }
  }
}

export async function saveSocialAction(id: string | undefined, data: any) {
  try {
    const session = await checkAuth()
    return await settingService.saveSocial(id, { ...data, createdBy: session.userId, updatedBy: session.userId })
  } catch (error: any) {
    console.error('[saveSocialAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to save social link' }
  }
}

export async function deleteSocialAction(id: string) {
  try {
    const session = await checkAuth()
    return await settingService.deleteSocial(id, session.userId)
  } catch (error: any) {
    console.error('[deleteSocialAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to delete social link' }
  }
}
