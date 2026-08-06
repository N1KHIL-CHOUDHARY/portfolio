'use server'

import { settingService } from '@/services/setting.service'
import { getAdminSession } from '@/lib/session'
import { GithubTheme } from '@/repositories/setting.repository'

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized session. Please log in again.')
  return session
}

export async function fetchGithubThemeAction() {
  try {
    return await settingService.getGithubTheme()
  } catch (error: any) {
    console.error('[fetchGithubThemeAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to fetch GitHub theme settings', data: undefined }
  }
}

export async function updateGithubThemeAction(theme: GithubTheme) {
  try {
    await checkAuth()
    return await settingService.updateGithubTheme(theme)
  } catch (error: any) {
    console.error('[updateGithubThemeAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to update GitHub theme settings', data: undefined }
  }
}
