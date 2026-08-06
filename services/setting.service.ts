import { settingRepository, GithubTheme } from '@/repositories/setting.repository'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { heroSchema, aboutSchema, seoSchema, socialSchema } from '@/lib/validations'

function handlePrismaError(error: unknown, fallbackMsg: string): string {
  console.error('[SettingService Error]:', error)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      return 'Setting record not found or already deleted.'
    }
  }
  return error instanceof Error ? error.message : fallbackMsg
}

export class SettingService {
  async getHero() {
    try {
      const data = await settingRepository.getHeroSetting()
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handlePrismaError(error, 'Failed to fetch hero settings'), data: undefined }
    }
  }

  async updateHero(input: any) {
    const validation = heroSchema.safeParse(input)
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues.map((i) => i.message).join(', '),
        data: undefined,
      }
    }

    try {
      const res = await settingRepository.updateHeroSetting(validation.data as any)
      revalidatePath('/')
      return { success: true, data: res }
    } catch (error) {
      return { success: false, error: handlePrismaError(error, 'Failed to update hero settings'), data: undefined }
    }
  }

  async getAbout() {
    try {
      const data = await settingRepository.getAboutSetting()
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handlePrismaError(error, 'Failed to fetch about settings'), data: undefined }
    }
  }

  async updateAbout(input: any) {
    const validation = aboutSchema.safeParse(input)
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues.map((i) => i.message).join(', '),
        data: undefined,
      }
    }

    try {
      const res = await settingRepository.updateAboutSetting(validation.data as any)
      revalidatePath('/')
      return { success: true, data: res }
    } catch (error) {
      return { success: false, error: handlePrismaError(error, 'Failed to update about settings'), data: undefined }
    }
  }

  async getSeo() {
    try {
      const data = await settingRepository.getSeoSetting()
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handlePrismaError(error, 'Failed to fetch SEO settings'), data: undefined }
    }
  }

  async updateSeo(input: any) {
    const validation = seoSchema.safeParse(input)
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues.map((i) => i.message).join(', '),
        data: undefined,
      }
    }

    try {
      const res = await settingRepository.updateSeoSetting(validation.data as any)
      revalidatePath('/')
      return { success: true, data: res }
    } catch (error) {
      return { success: false, error: handlePrismaError(error, 'Failed to update SEO settings'), data: undefined }
    }
  }

  async getSocials() {
    try {
      const items = await settingRepository.getSocialLinks()
      return { success: true, items }
    } catch (error) {
      return { success: false, error: handlePrismaError(error, 'Failed to fetch social links'), items: [] }
    }
  }

  async saveSocial(id: string | undefined, input: any) {
    const validation = socialSchema.safeParse(input)
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues.map((i) => i.message).join(', '),
        data: undefined,
      }
    }

    try {
      const item = await settingRepository.upsertSocialLink(id, validation.data as any)
      revalidatePath('/')
      return { success: true, data: item }
    } catch (error) {
      return { success: false, error: handlePrismaError(error, 'Failed to save social link'), data: undefined }
    }
  }

  async deleteSocial(id: string, userId?: string) {
    try {
      const item = await settingRepository.softDeleteSocialLink(id, userId)
      revalidatePath('/')
      return { success: true, data: item }
    } catch (error) {
      return { success: false, error: handlePrismaError(error, 'Failed to delete social link'), data: undefined }
    }
  }

  async getGithubTheme() {
    try {
      const data = await settingRepository.getGithubTheme()
      return { success: true, data }
    } catch (error) {
      return { success: false, error: handlePrismaError(error, 'Failed to fetch GitHub theme settings'), data: undefined }
    }
  }

  async updateGithubTheme(theme: GithubTheme) {
    try {
      const res = await settingRepository.updateGithubTheme(theme)
      revalidatePath('/')
      return { success: true, data: res }
    } catch (error) {
      return { success: false, error: handlePrismaError(error, 'Failed to update GitHub theme settings'), data: undefined }
    }
  }
}

export const settingService = new SettingService()
