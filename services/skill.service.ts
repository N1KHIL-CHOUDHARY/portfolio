import { skillRepository } from '@/repositories/skill.repository'
import { SkillCategory, Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export class SkillService {
  async getSkills() {
    try {
      const items = await skillRepository.findMany()
      return { success: true, items }
    } catch {
      return { success: false, error: 'Failed to fetch skills', items: [] }
    }
  }

  async createSkill(input: {
    name: string
    category: SkillCategory
    icon?: string
    color?: string
    proficiency?: number
    order?: number
    featured?: boolean
    userId?: string
  }) {
    try {
      const { userId, ...data } = input
      const item = await skillRepository.create({
        ...data,
        createdBy: userId,
      })
      revalidatePath('/')
      return { success: true, data: item }
    } catch (error) {
      console.error('Error creating skill:', error)
      return { success: false, error: 'Failed to create skill' }
    }
  }

  async updateSkill(id: string, input: Partial<Prisma.SkillUpdateInput> & { userId?: string }) {
    try {
      const { userId, ...data } = input
      const item = await skillRepository.update(id, {
        ...data,
        updatedBy: userId,
      })
      revalidatePath('/')
      return { success: true, data: item }
    } catch (error) {
      console.error('Error updating skill:', error)
      return { success: false, error: 'Failed to update skill' }
    }
  }

  async softDeleteSkill(id: string, userId?: string) {
    try {
      const item = await skillRepository.softDelete(id, userId)
      revalidatePath('/')
      return { success: true, data: item }
    } catch {
      return { success: false, error: 'Failed to delete skill' }
    }
  }
}

export const skillService = new SkillService()
