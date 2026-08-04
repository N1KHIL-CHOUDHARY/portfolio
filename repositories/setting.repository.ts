import { prisma } from '@/lib/prisma'
import { HeroSetting, AboutSetting, SeoSetting, SocialLink, Prisma } from '@prisma/client'

export class SettingRepository {
  // Hero Single Row
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

  // About Single Row
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

  // SEO Single Row
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

  // Social Links
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
}

export const settingRepository = new SettingRepository()
