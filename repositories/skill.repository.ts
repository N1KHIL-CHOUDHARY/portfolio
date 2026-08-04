import { prisma } from '@/lib/prisma'
import { Skill, SkillCategory, Prisma } from '@prisma/client'

export class SkillRepository {
  async findMany(includeDeleted = false) {
    return prisma.skill.findMany({
      where: includeDeleted ? {} : { deletedAt: null },
      orderBy: [{ category: 'asc' }, { order: 'asc' }, { name: 'asc' }],
    })
  }

  async create(data: Prisma.SkillCreateInput) {
    return prisma.skill.create({ data })
  }

  async update(id: string, data: Prisma.SkillUpdateInput) {
    return prisma.skill.update({ where: { id }, data })
  }

  async softDelete(id: string, userId?: string) {
    return prisma.skill.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy: userId },
    })
  }
}

export const skillRepository = new SkillRepository()
