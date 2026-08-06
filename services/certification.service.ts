import { certificationRepository } from '@/repositories/certification.repository'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { certificationSchema, certificationUpdateSchema } from '@/lib/validations'

function handlePrismaError(error: unknown, fallbackMsg: string): string {
  console.error('[CertificationService Error]:', error)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      return 'Certification record not found or already deleted.'
    }
  }
  return error instanceof Error ? error.message : fallbackMsg
}

export class CertificationService {
  async getCertifications() {
    try {
      const items = await certificationRepository.findMany()
      return { success: true, items }
    } catch (error) {
      return {
        success: false,
        error: handlePrismaError(error, 'Failed to fetch certifications'),
        items: [],
      }
    }
  }

  async createCertification(input: any) {
    const validation = certificationSchema.safeParse(input)
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues.map((i) => i.message).join(', '),
      }
    }

    const data = validation.data
    try {
      const item = await certificationRepository.create({
        title: data.title,
        issuer: data.issuer,
        issueDate: data.issueDate,
        credentialUrl: data.credentialUrl || null,
        credentialId: data.credentialId || null,
        certificateImage: data.certificateImage || null,
        skills: data.skills as unknown as Prisma.InputJsonValue,
        featured: data.featured,
        order: data.order,
        createdBy: input.userId,
      })
      revalidatePath('/')
      revalidatePath('/certifications')
      return { success: true, data: item }
    } catch (error) {
      return { success: false, error: handlePrismaError(error, 'Failed to create certification') }
    }
  }

  async updateCertification(id: string, input: any) {
    const validation = certificationUpdateSchema.safeParse(input)
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues.map((i) => i.message).join(', '),
      }
    }

    try {
      const { userId, ...data } = input
      const updateData: Prisma.CertificationUpdateInput = {
        ...data,
        updatedBy: userId,
        skills: data.skills !== undefined ? (data.skills as unknown as Prisma.InputJsonValue) : undefined,
      }

      const item = await certificationRepository.update(id, updateData)
      revalidatePath('/')
      revalidatePath('/certifications')
      return { success: true, data: item }
    } catch (error) {
      return { success: false, error: handlePrismaError(error, 'Failed to update certification') }
    }
  }

  async softDeleteCertification(id: string, userId?: string) {
    try {
      const item = await certificationRepository.softDelete(id, userId)
      revalidatePath('/')
      revalidatePath('/certifications')
      return { success: true, data: item }
    } catch (error) {
      return { success: false, error: handlePrismaError(error, 'Failed to delete certification') }
    }
  }
}

export const certificationService = new CertificationService()
