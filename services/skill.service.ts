import { skillRepository } from '@/repositories/skill.repository'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { skillSchema, skillUpdateSchema } from '@/lib/validations'

function handlePrismaError(error: unknown, fallbackMsg: string): string {
  console.error('[SkillService Error]:', error)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      return 'Skill record not found or already deleted.'
    }
  }
  return error instanceof Error ? error.message : fallbackMsg
}

export class SkillService {
  async getSkills() {
    try {
      const items = await skillRepository.findMany()
      return { success: true, items }
    } catch (error) {
      return {
        success: false,
        error: handlePrismaError(error, 'Failed to fetch skills'),
        items: [],
      }
    }
  }

  async createSkill(input: any) {
    const validation = skillSchema.safeParse(input)
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues.map((i) => i.message).join(', '),
      }
    }

    const data = validation.data
    try {
      const item = await skillRepository.create({
        name: data.name,
        category: data.category,
        icon: data.icon || null,
        color: data.color || null,
        proficiency: data.proficiency,
        order: data.order,
        featured: data.featured,
        createdBy: input.userId,
      })
      revalidatePath('/')
      return { success: true, data: item }
    } catch (error) {
      return { success: false, error: handlePrismaError(error, 'Failed to create skill') }
    }
  }

  async updateSkill(id: string, input: any) {
    const validation = skillUpdateSchema.safeParse(input)
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues.map((i) => i.message).join(', '),
      }
    }

    try {
      const { userId, ...data } = input
      const item = await skillRepository.update(id, {
        ...data,
        updatedBy: userId,
      })
      revalidatePath('/')
      return { success: true, data: item }
    } catch (error) {
      return { success: false, error: handlePrismaError(error, 'Failed to update skill') }
    }
  }

  async softDeleteSkill(id: string, userId?: string) {
    try {
      const item = await skillRepository.softDelete(id, userId)
      revalidatePath('/')
      return { success: true, data: item }
    } catch (error) {
      return { success: false, error: handlePrismaError(error, 'Failed to delete skill') }
    }
  }
}

export const skillService = new SkillService()
