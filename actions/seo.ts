'use server'

import { settingService } from '@/services/setting.service'
import { getAdminSession } from '@/lib/session'

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized session. Please log in again.')
  return session
}

export async function fetchSeoAction() {
  try {
    return await settingService.getSeo()
  } catch (error: any) {
    console.error('[fetchSeoAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to fetch SEO settings', data: undefined }
  }
}

export async function updateSeoAction(data: any) {
  try {
    const session = await checkAuth()
    return await settingService.updateSeo({ ...data, updatedBy: session.userId })
  } catch (error: any) {
    console.error('[updateSeoAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to update SEO settings', data: undefined }
  }
}
