import { developmentRepository } from '@/repositories/development.repository'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/utils'
import { developmentSchema, developmentUpdateSchema } from '@/lib/validations'

function handlePrismaError(error: unknown, fallbackMsg: string): string {
  console.error('[DevelopmentService Error]:', error)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      return 'Development setup record not found or already deleted.'
    }
  }
  return error instanceof Error ? error.message : fallbackMsg
}

export class DevelopmentService {
  async getDevelopmentItems() {
    try {
      const items = await developmentRepository.findMany()
      return { success: true, items }
    } catch (error) {
      return {
        success: false,
        error: handlePrismaError(error, 'Failed to fetch development items'),
        items: [],
      }
    }
  }

  async createDevelopmentItem(input: any) {
    const validation = developmentSchema.safeParse(input)
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues.map((i) => i.message).join(', '),
      }
    }

    const data = validation.data
    try {
      const targetSlug = data.slug ? slugify(data.slug) : slugify(data.title)
      const item = await developmentRepository.create({
        title: data.title,
        slug: targetSlug,
        subtitle: data.subtitle || null,
        category: data.category,
        whyIUseIt: data.whyIUseIt,
        tags: data.tags as unknown as Prisma.InputJsonValue,
        specs: data.specs as unknown as Prisma.InputJsonValue,
        configSnippetFilename: data.configSnippetFilename || null,
        configSnippetCode: data.configSnippetCode || null,
        links: data.links as unknown as Prisma.InputJsonValue,
        order: data.order,
        createdBy: input.userId,
      })
      revalidatePath('/')
      revalidatePath('/development')
      return { success: true, data: item }
    } catch (error) {
      return { success: false, error: handlePrismaError(error, 'Failed to create development setup entry') }
    }
  }

  async updateDevelopmentItem(id: string, input: any) {
    const validation = developmentUpdateSchema.safeParse(input)
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues.map((i) => i.message).join(', '),
      }
    }

    try {
      const { userId, ...data } = input
      const updateData: Prisma.DevelopmentSetupUpdateInput = {
        ...data,
        updatedBy: userId,
        tags: data.tags !== undefined ? (data.tags as unknown as Prisma.InputJsonValue) : undefined,
        specs: data.specs !== undefined ? (data.specs as unknown as Prisma.InputJsonValue) : undefined,
        links: data.links !== undefined ? (data.links as unknown as Prisma.InputJsonValue) : undefined,
      }

      if (data.slug) {
        updateData.slug = slugify(data.slug)
      }

      const item = await developmentRepository.update(id, updateData)
      revalidatePath('/')
      revalidatePath('/development')
      return { success: true, data: item }
    } catch (error) {
      return { success: false, error: handlePrismaError(error, 'Failed to update development entry') }
    }
  }

  async softDeleteDevelopmentItem(id: string, userId?: string) {
    try {
      const item = await developmentRepository.softDelete(id, userId)
      revalidatePath('/')
      revalidatePath('/development')
      return { success: true, data: item }
    } catch (error) {
      return { success: false, error: handlePrismaError(error, 'Failed to delete development entry') }
    }
  }
}

export const developmentService = new DevelopmentService()
