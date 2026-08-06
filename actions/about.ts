'use server'

import { settingService } from '@/services/setting.service'
import { getAdminSession } from '@/lib/session'

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized session. Please log in again.')
  return session
}

export async function fetchAboutAction() {
  try {
    return await settingService.getAbout()
  } catch (error: any) {
    console.error('[fetchAboutAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to fetch about settings', data: undefined }
  }
}

export async function updateAboutAction(data: any) {
  try {
    const session = await checkAuth()
    return await settingService.updateAbout({ ...data, updatedBy: session.userId })
  } catch (error: any) {
    console.error('[updateAboutAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to update about settings', data: undefined }
  }
}
