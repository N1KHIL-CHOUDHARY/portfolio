'use server'

import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'
import { revalidatePath, revalidateTag } from 'next/cache'
import { GithubTheme, ModeTheme, DEFAULT_GITHUB_THEME } from '@/lib/github'

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized session. Please log in again.')
  return session
}

export async function fetchGithubThemeAction() {
  try {
    const about = await prisma.aboutSetting.findFirst()
    if (about && about.customCards) {
      const cards = typeof about.customCards === 'string' ? JSON.parse(about.customCards) : about.customCards
      if (cards && typeof cards === 'object' && 'githubTheme' in cards) {
        const stored = cards.githubTheme
        if (stored.light && stored.dark) {
          return { success: true, data: stored as GithubTheme }
        }
        if (stored.level0) {
          return {
            success: true,
            data: {
              light: DEFAULT_GITHUB_THEME.light,
              dark: stored as ModeTheme,
            },
          }
        }
      }
    }
    return { success: true, data: DEFAULT_GITHUB_THEME }
  } catch (error: any) {
    console.error('[fetchGithubThemeAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to fetch GitHub theme settings', data: undefined }
  }
}

export async function updateGithubThemeAction(theme: GithubTheme) {
  try {
    const session = await checkAuth()
    const existing = await prisma.aboutSetting.findFirst()
    let currentCards: any = {}
    if (existing && existing.customCards) {
      try {
        currentCards = typeof existing.customCards === 'string' ? JSON.parse(existing.customCards) : existing.customCards
      } catch {}
    }
    if (Array.isArray(currentCards)) {
      currentCards = { cards: currentCards }
    }
    currentCards.githubTheme = theme

    let res
    if (existing) {
      res = await prisma.aboutSetting.update({
        where: { id: existing.id },
        data: {
          customCards: JSON.stringify(currentCards),
          updatedBy: session.userId,
        },
      })
    } else {
      res = await prisma.aboutSetting.create({
        data: {
          content: 'Default content',
          customCards: JSON.stringify(currentCards),
          updatedBy: session.userId,
        },
      })
    }

    revalidateTag('github-theme', 'max')
    revalidatePath('/')

    return { success: true, data: res }
  } catch (error: any) {
    console.error('[updateGithubThemeAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to update GitHub theme settings', data: undefined }
  }
}
