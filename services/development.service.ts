import { developmentRepository } from '@/repositories/development.repository'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/utils'

export class DevelopmentService {
  async getDevelopmentItems() {
    try {
      const items = await developmentRepository.findMany()
      return { success: true, items }
    } catch {
      return { success: false, error: 'Failed to fetch development items', items: [] }
    }
  }

  async createDevelopmentItem(input: {
    title: string
    slug?: string
    subtitle?: string
    category: string
    whyIUseIt: string
    tags?: string[]
    specs?: { label: string; value: string }[]
    configSnippetFilename?: string
    configSnippetCode?: string
    links?: { label: string; url: string }[]
    order?: number
    userId?: string
  }) {
    try {
      const targetSlug = input.slug ? slugify(input.slug) : slugify(input.title)
      const item = await developmentRepository.create({
        title: input.title,
        slug: targetSlug,
        subtitle: input.subtitle,
        category: input.category,
        whyIUseIt: input.whyIUseIt,
        tags: JSON.stringify(input.tags || []),
        specs: JSON.stringify(input.specs || []),
        configSnippetFilename: input.configSnippetFilename,
        configSnippetCode: input.configSnippetCode,
        links: JSON.stringify(input.links || []),
        order: input.order || 0,
        createdBy: input.userId,
      })
      revalidatePath('/')
      revalidatePath('/development')
      return { success: true, data: item }
    } catch {
      return { success: false, error: 'Failed to create development setup entry' }
    }
  }

  async updateDevelopmentItem(id: string, input: any) {
    try {
      const item = await developmentRepository.update(id, input)
      revalidatePath('/')
      revalidatePath('/development')
      return { success: true, data: item }
    } catch {
      return { success: false, error: 'Failed to update entry' }
    }
  }

  async softDeleteDevelopmentItem(id: string, userId?: string) {
    try {
      const item = await developmentRepository.softDelete(id, userId)
      revalidatePath('/')
      revalidatePath('/development')
      return { success: true, data: item }
    } catch {
      return { success: false, error: 'Failed to delete entry' }
    }
  }
}

export const developmentService = new DevelopmentService()
