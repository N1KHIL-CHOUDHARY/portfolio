import { prisma } from '@/lib/prisma'
import { DevelopmentSetup, Prisma } from '@prisma/client'

export class DevelopmentRepository {
  async findMany(includeDeleted = false) {
    return prisma.developmentSetup.findMany({
      where: includeDeleted ? {} : { deletedAt: null },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
  }

  async findBySlug(slug: string) {
    return prisma.developmentSetup.findUnique({ where: { slug } })
  }

  async create(data: Prisma.DevelopmentSetupCreateInput) {
    return prisma.developmentSetup.create({ data })
  }

  async update(id: string, data: Prisma.DevelopmentSetupUpdateInput) {
    return prisma.developmentSetup.update({ where: { id }, data })
  }

  async softDelete(id: string, userId?: string) {
    return prisma.developmentSetup.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy: userId },
    })
  }
}

export const developmentRepository = new DevelopmentRepository()
