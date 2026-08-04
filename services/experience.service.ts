import { experienceRepository } from '@/repositories/experience.repository'
import { EmploymentType, Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export class ExperienceService {
  async getExperiences(includeDeleted = false) {
    try {
      const items = await experienceRepository.findMany(includeDeleted)
      return { success: true, items }
    } catch {
      return { success: false, error: 'Failed to fetch experience items', items: [] }
    }
  }

  async createExperience(input: {
    company: string
    role: string
    location?: string
    employmentType?: EmploymentType
    startDate: string
    endDate?: string
    currentJob?: boolean
    description: string
    responsibilities?: string[]
    technologies?: string[]
    companyLogo?: string
    order?: number
    userId?: string
  }) {
    try {
      const createData: Prisma.ExperienceCreateInput = {
        company: input.company,
        role: input.role,
        location: input.location,
        employmentType: input.employmentType || EmploymentType.FULL_TIME,
        startDate: input.startDate,
        endDate: input.endDate,
        currentJob: input.currentJob ?? false,
        description: input.description,
        responsibilities: JSON.stringify(input.responsibilities || []),
        technologies: JSON.stringify(input.technologies || []),
        companyLogo: input.companyLogo,
        order: input.order || 0,
        createdBy: input.userId,
      }

      const item = await experienceRepository.create(createData)
      revalidatePath('/')
      revalidatePath('/experience')
      return { success: true, data: item }
    } catch {
      return { success: false, error: 'Failed to create experience entry' }
    }
  }

  async updateExperience(
    id: string,
    input: Partial<{
      company: string
      role: string
      location: string
      employmentType: EmploymentType
      startDate: string
      endDate: string
      currentJob: boolean
      description: string
      responsibilities: string[]
      technologies: string[]
      companyLogo: string
      order: number
      userId: string
    }>
  ) {
    try {
      const updateData: Prisma.ExperienceUpdateInput = {
        ...input,
        updatedBy: input.userId,
        responsibilities: input.responsibilities ? JSON.stringify(input.responsibilities) : undefined,
        technologies: input.technologies ? JSON.stringify(input.technologies) : undefined,
      }

      const item = await experienceRepository.update(id, updateData)
      revalidatePath('/')
      revalidatePath('/experience')
      return { success: true, data: item }
    } catch {
      return { success: false, error: 'Failed to update experience entry' }
    }
  }

  async softDeleteExperience(id: string, userId?: string) {
    try {
      const item = await experienceRepository.softDelete(id, userId)
      revalidatePath('/')
      revalidatePath('/experience')
      return { success: true, data: item }
    } catch {
      return { success: false, error: 'Failed to delete experience' }
    }
  }
}

export const experienceService = new ExperienceService()
