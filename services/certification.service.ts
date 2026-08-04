import { certificationRepository } from '@/repositories/certification.repository'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export class CertificationService {
  async getCertifications() {
    try {
      const items = await certificationRepository.findMany()
      return { success: true, items }
    } catch {
      return { success: false, error: 'Failed to fetch certifications', items: [] }
    }
  }

  async createCertification(input: {
    title: string
    issuer: string
    issueDate: string
    credentialUrl?: string
    credentialId?: string
    certificateImage?: string
    featured?: boolean
    order?: number
    userId?: string
  }) {
    try {
      const { userId, ...data } = input
      const item = await certificationRepository.create({
        ...data,
        createdBy: userId,
      })
      revalidatePath('/')
      revalidatePath('/certifications')
      return { success: true, data: item }
    } catch {
      return { success: false, error: 'Failed to create certification' }
    }
  }

  async updateCertification(id: string, input: Partial<Prisma.CertificationUpdateInput> & { userId?: string }) {
    try {
      const { userId, ...data } = input
      const item = await certificationRepository.update(id, {
        ...data,
        updatedBy: userId,
      })
      revalidatePath('/')
      revalidatePath('/certifications')
      return { success: true, data: item }
    } catch {
      return { success: false, error: 'Failed to update certification' }
    }
  }

  async softDeleteCertification(id: string, userId?: string) {
    try {
      const item = await certificationRepository.softDelete(id, userId)
      revalidatePath('/')
      revalidatePath('/certifications')
      return { success: true, data: item }
    } catch {
      return { success: false, error: 'Failed to delete certification' }
    }
  }
}

export const certificationService = new CertificationService()
