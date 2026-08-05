import { prisma } from '@/lib/prisma'
import { HeroSetting, AboutSetting, SeoSetting, SocialLink, Prisma } from '@prisma/client'

export interface ModeTheme {
  level0: string
  level1: string
  level2: string
  level3: string
  level4: string
}

export interface GithubTheme {
  light: ModeTheme
  dark: ModeTheme
}

export const DEFAULT_GITHUB_THEME: GithubTheme = {
  light: {
    level0: '#ebedf0',
    level1: '#9be9a8',
    level2: '#40c463',
    level3: '#30a14e',
    level4: '#216e39',
  },
  dark: {
    level0: '#161b22',
    level1: '#0e4429',
    level2: '#006d32',
    level3: '#26a641',
    level4: '#39d353',
  },
}

export class SettingRepository {
  async getHeroSetting() {
    return prisma.heroSetting.findFirst()
  }

  async updateHeroSetting(data: Prisma.HeroSettingCreateInput) {
    const existing = await prisma.heroSetting.findFirst()
    if (existing) {
      return prisma.heroSetting.update({ where: { id: existing.id }, data })
    }
    return prisma.heroSetting.create({ data })
  }

  async getAboutSetting() {
    return prisma.aboutSetting.findFirst()
  }

  async updateAboutSetting(data: Prisma.AboutSettingCreateInput) {
    const existing = await prisma.aboutSetting.findFirst()
    if (existing) {
      return prisma.aboutSetting.update({ where: { id: existing.id }, data })
    }
    return prisma.aboutSetting.create({ data })
  }

  async getSeoSetting() {
    return prisma.seoSetting.findFirst()
  }

  async updateSeoSetting(data: Prisma.SeoSettingCreateInput) {
    const existing = await prisma.seoSetting.findFirst()
    if (existing) {
      return prisma.seoSetting.update({ where: { id: existing.id }, data })
    }
    return prisma.seoSetting.create({ data })
  }

  async getSocialLinks() {
    return prisma.socialLink.findMany({
      where: { deletedAt: null },
      orderBy: { order: 'asc' },
    })
  }

  async upsertSocialLink(id: string | undefined, data: Prisma.SocialLinkCreateInput) {
    if (id) {
      return prisma.socialLink.update({ where: { id }, data })
    }
    return prisma.socialLink.create({ data })
  }

  async softDeleteSocialLink(id: string, userId?: string) {
    return prisma.socialLink.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy: userId },
    })
  }

  async getGithubTheme(): Promise<GithubTheme> {
    try {
      const about = await prisma.aboutSetting.findFirst()
      if (about && about.customCards) {
        const cards = typeof about.customCards === 'string' ? JSON.parse(about.customCards) : about.customCards
        if (cards && typeof cards === 'object' && 'githubTheme' in cards) {
          const stored = cards.githubTheme
          if (stored.light && stored.dark) {
            return stored as GithubTheme
          }
          if (stored.level0) {
            return {
              light: DEFAULT_GITHUB_THEME.light,
              dark: stored as ModeTheme,
            }
          }
        }
      }
    } catch {}
    return DEFAULT_GITHUB_THEME
  }

  async updateGithubTheme(theme: GithubTheme) {
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

    if (existing) {
      return prisma.aboutSetting.update({
        where: { id: existing.id },
        data: { customCards: JSON.stringify(currentCards) },
      })
    } else {
      return prisma.aboutSetting.create({
        data: {
          content: 'Default content',
          customCards: JSON.stringify(currentCards),
        },
      })
    }
  }
}

export const settingRepository = new SettingRepository()
