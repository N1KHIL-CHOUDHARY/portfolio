'use server'

import { settingService } from '@/services/setting.service'
import { getAdminSession } from '@/lib/session'
import { GithubTheme } from '@/repositories/setting.repository'

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized')
  return session
}

export async function fetchGithubThemeAction() {
  return settingService.getGithubTheme()
}

export async function updateGithubThemeAction(theme: GithubTheme) {
  await checkAuth()
  return settingService.updateGithubTheme(theme)
}
