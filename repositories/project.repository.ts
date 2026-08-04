import { prisma } from '@/lib/prisma'
import { Project, ProjectStatus, Prisma } from '@prisma/client'

export interface ProjectFindOptions {
  includeDeleted?: boolean
  status?: ProjectStatus
  featuredOnly?: boolean
  search?: string
  page?: number
  limit?: number
}

export class ProjectRepository {
  async findMany(options: ProjectFindOptions = {}) {
    const {
      includeDeleted = false,
      status,
      featuredOnly,
      search,
      page = 1,
      limit = 20,
    } = options

    const where: Prisma.ProjectWhereInput = {}

    if (!includeDeleted) {
      where.deletedAt = null
    }

    if (status) {
      where.status = status
    }

    if (featuredOnly) {
      where.featured = true
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [items, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.project.count({ where }),
    ])

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findBySlug(slug: string, includeDeleted = false) {
    return prisma.project.findFirst({
      where: {
        slug,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
    })
  }

  async findById(id: string) {
    return prisma.project.findUnique({
      where: { id },
    })
  }

  async create(data: Prisma.ProjectCreateInput) {
    return prisma.project.create({ data })
  }

  async update(id: string, data: Prisma.ProjectUpdateInput) {
    return prisma.project.update({
      where: { id },
      data,
    })
  }

  async softDelete(id: string, userId?: string) {
    return prisma.project.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: userId,
      },
    })
  }

  async restore(id: string, userId?: string) {
    return prisma.project.update({
      where: { id },
      data: {
        deletedAt: null,
        updatedBy: userId,
      },
    })
  }

  async permanentDelete(id: string) {
    return prisma.project.delete({
      where: { id },
    })
  }

  async updateOrder(id: string, order: number) {
    return prisma.project.update({
      where: { id },
      data: { order },
    })
  }
}

export const projectRepository = new ProjectRepository()
