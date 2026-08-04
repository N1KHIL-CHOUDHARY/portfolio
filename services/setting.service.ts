import { settingRepository } from '@/repositories/setting.repository'
import { revalidatePath } from 'next/cache'

export class SettingService {
  // Hero
  async getHero() {
    try {
      const data = await settingRepository.getHeroSetting()
      return { success: true, data }
    } catch {
      return { success: false, error: 'Failed to fetch hero settings' }
    }
  }

  async updateHero(data: any) {
    try {
      const res = await settingRepository.updateHeroSetting(data)
      revalidatePath('/')
      return { success: true, data: res }
    } catch {
      return { success: false, error: 'Failed to update hero settings' }
    }
  }

  // About
  async getAbout() {
    try {
      const data = await settingRepository.getAboutSetting()
      return { success: true, data }
    } catch {
      return { success: false, error: 'Failed to fetch about settings' }
    }
  }

  async updateAbout(data: any) {
    try {
      const res = await settingRepository.updateAboutSetting(data)
      revalidatePath('/')
      return { success: true, data: res }
    } catch {
      return { success: false, error: 'Failed to update about settings' }
    }
  }

  // SEO
  async getSeo() {
    try {
      const data = await settingRepository.getSeoSetting()
      return { success: true, data }
    } catch {
      return { success: false, error: 'Failed to fetch SEO settings' }
    }
  }

  async updateSeo(data: any) {
    try {
      const res = await settingRepository.updateSeoSetting(data)
      revalidatePath('/')
      return { success: true, data: res }
    } catch {
      return { success: false, error: 'Failed to update SEO settings' }
    }
  }

  // Social
  async getSocials() {
    try {
      const items = await settingRepository.getSocialLinks()
      return { success: true, items }
    } catch {
      return { success: false, error: 'Failed to fetch social links', items: [] }
    }
  }

  async saveSocial(id: string | undefined, data: any) {
    try {
      const item = await settingRepository.upsertSocialLink(id, data)
      revalidatePath('/')
      return { success: true, data: item }
    } catch {
      return { success: false, error: 'Failed to save social link' }
    }
  }

  async deleteSocial(id: string, userId?: string) {
    try {
      const item = await settingRepository.softDeleteSocialLink(id, userId)
      revalidatePath('/')
      return { success: true, data: item }
    } catch {
      return { success: false, error: 'Failed to delete social link' }
    }
  }
}

export const settingService = new SettingService()
