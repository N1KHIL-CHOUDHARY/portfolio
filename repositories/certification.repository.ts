import { prisma } from '@/lib/prisma'
import { Certification, Prisma } from '@prisma/client'

export class CertificationRepository {
  async findMany(includeDeleted = false) {
    return prisma.certification.findMany({
      where: includeDeleted ? {} : { deletedAt: null },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
  }

  async create(data: Prisma.CertificationCreateInput) {
    return prisma.certification.create({ data })
  }

  async update(id: string, data: Prisma.CertificationUpdateInput) {
    return prisma.certification.update({ where: { id }, data })
  }

  async softDelete(id: string, userId?: string) {
    return prisma.certification.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy: userId },
    })
  }
}

export const certificationRepository = new CertificationRepository()
