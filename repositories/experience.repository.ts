import { prisma } from '@/lib/prisma'
import { Experience, Prisma } from '@prisma/client'

export class ExperienceRepository {
  async findMany(includeDeleted = false) {
    return prisma.experience.findMany({
      where: includeDeleted ? {} : { deletedAt: null },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
  }

  async findById(id: string) {
    return prisma.experience.findUnique({ where: { id } })
  }

  async create(data: Prisma.ExperienceCreateInput) {
    return prisma.experience.create({ data })
  }

  async update(id: string, data: Prisma.ExperienceUpdateInput) {
    return prisma.experience.update({ where: { id }, data })
  }

  async softDelete(id: string, userId?: string) {
    return prisma.experience.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy: userId },
    })
  }

  async restore(id: string, userId?: string) {
    return prisma.experience.update({
      where: { id },
      data: { deletedAt: null, updatedBy: userId },
    })
  }
}

export const experienceRepository = new ExperienceRepository()
