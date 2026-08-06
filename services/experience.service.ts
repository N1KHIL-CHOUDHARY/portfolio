import { experienceRepository } from '@/repositories/experience.repository'
import { EmploymentType, Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { experienceSchema, experienceUpdateSchema } from '@/lib/validations'

function handlePrismaError(error: unknown, fallbackMsg: string): string {
  console.error('[ExperienceService Error]:', error)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      return 'Experience record not found or already deleted.'
    }
  }
  return error instanceof Error ? error.message : fallbackMsg
}

export class ExperienceService {
  async getExperiences(includeDeleted = false) {
    try {
      const items = await experienceRepository.findMany(includeDeleted)
      return { success: true, items }
    } catch (error) {
      return {
        success: false,
        error: handlePrismaError(error, 'Failed to fetch experience items'),
        items: [],
      }
    }
  }

  async createExperience(input: any) {
    const validation = experienceSchema.safeParse(input)
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues.map((i) => i.message).join(', '),
      }
    }

    const data = validation.data
    try {
      const createData: Prisma.ExperienceCreateInput = {
        company: data.company,
        role: data.role,
        location: data.location || null,
        employmentType: data.employmentType || EmploymentType.FULL_TIME,
        startDate: data.startDate,
        endDate: data.currentJob ? 'Present' : data.endDate || null,
        currentJob: data.currentJob ?? false,
        description: data.description,
        responsibilities: data.responsibilities as unknown as Prisma.InputJsonValue,
        technologies: data.technologies as unknown as Prisma.InputJsonValue,
        companyLogo: data.companyLogo || null,
        order: data.order || 0,
        createdBy: input.userId,
      }

      const item = await experienceRepository.create(createData)
      revalidatePath('/')
      revalidatePath('/experience')
      return { success: true, data: item }
    } catch (error) {
      return { success: false, error: handlePrismaError(error, 'Failed to create experience entry') }
    }
  }

  async updateExperience(id: string, input: any) {
    const validation = experienceUpdateSchema.safeParse(input)
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues.map((i) => i.message).join(', '),
      }
    }

    try {
      const { userId, ...data } = input
      const updateData: Prisma.ExperienceUpdateInput = {
        ...data,
        updatedBy: userId,
        endDate: data.currentJob ? 'Present' : data.endDate,
        responsibilities: data.responsibilities !== undefined ? (data.responsibilities as unknown as Prisma.InputJsonValue) : undefined,
        technologies: data.technologies !== undefined ? (data.technologies as unknown as Prisma.InputJsonValue) : undefined,
      }

      const item = await experienceRepository.update(id, updateData)
      revalidatePath('/')
      revalidatePath('/experience')
      return { success: true, data: item }
    } catch (error) {
      return { success: false, error: handlePrismaError(error, 'Failed to update experience entry') }
    }
  }

  async softDeleteExperience(id: string, userId?: string) {
    try {
      const item = await experienceRepository.softDelete(id, userId)
      revalidatePath('/')
      revalidatePath('/experience')
      return { success: true, data: item }
    } catch (error) {
      return { success: false, error: handlePrismaError(error, 'Failed to delete experience') }
    }
  }
}

export const experienceService = new ExperienceService()
