'use server'

import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'
import { ProjectStatus, Prisma } from '@prisma/client'
import { revalidatePath, revalidateTag } from 'next/cache'
import { slugify } from '@/lib/utils'
import { projectSchema, projectUpdateSchema } from '@/lib/validations'

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) {
    throw new Error('Unauthorized session. Please log in again.')
  }
  return session
}

export async function fetchProjectsAction(options: {
  includeDeleted?: boolean
  status?: ProjectStatus
  search?: string
  page?: number
  limit?: number
} = {}) {
  try {
    const { includeDeleted = false, status, search, page = 1, limit = 20 } = options
    const where: Prisma.ProjectWhereInput = {}

    if (!includeDeleted) where.deletedAt = null
    if (status) where.status = status
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

    return { success: true, items, total, page, limit, totalPages: Math.ceil(total / limit) }
  } catch (error: any) {
    console.error('[fetchProjectsAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to fetch projects', items: [], total: 0 }
  }
}

export async function fetchProjectBySlugAction(slug: string) {
  try {
    const project = await prisma.project.findFirst({
      where: { slug, deletedAt: null },
    })
    if (!project) return { success: false, error: 'Project not found', data: undefined }
    return { success: true, data: project }
  } catch (error: any) {
    console.error('[fetchProjectBySlugAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to fetch project', data: undefined }
  }
}

export async function fetchProjectByIdAction(id: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
    })
    if (!project) return { success: false, error: 'Project not found', data: undefined }
    return { success: true, data: project }
  } catch (error: any) {
    console.error('[fetchProjectByIdAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to fetch project', data: undefined }
  }
}

export async function createProjectAction(input: any) {
  try {
    const session = await checkAuth()
    const validation = projectSchema.safeParse(input)
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues.map((i) => i.message).join(', '),
        data: undefined,
      }
    }

    const data = validation.data
    const targetSlug = data.slug ? slugify(data.slug) : slugify(data.title)
    const existing = await prisma.project.findFirst({ where: { slug: targetSlug } })
    const finalSlug = existing ? `${targetSlug}-${Date.now().toString().slice(-4)}` : targetSlug

    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug: finalSlug,
        subtitle: data.subtitle || null,
        role: data.role || null,
        timeline: data.timeline || null,
        description: data.description,
        content: data.content || '',
        thumbnail: data.thumbnail || null,
        gallery: data.gallery as unknown as Prisma.InputJsonValue,
        tags: data.tags as unknown as Prisma.InputJsonValue,
        architecture: data.architecture as unknown as Prisma.InputJsonValue,
        coreProblem: data.coreProblem || null,
        highlights: data.highlights as unknown as Prisma.InputJsonValue,
        codeSnippetFilename: data.codeSnippetFilename || null,
        codeSnippetCode: data.codeSnippetCode || null,
        githubUrl: data.githubUrl || null,
        liveUrl: data.liveUrl || null,
        stars: data.stars,
        forks: data.forks,
        status: data.status,
        featured: data.featured,
        order: data.order,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        createdBy: session.userId,
      },
    })

    revalidateTag('projects', 'max')
    revalidatePath('/')
    revalidatePath('/projects')
    revalidatePath(`/projects/${project.slug}`)

    return { success: true, data: project }
  } catch (error: any) {
    console.error('[createProjectAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to create project', data: undefined }
  }
}

export async function updateProjectAction(id: string, input: any) {
  try {
    const session = await checkAuth()
    const validation = projectUpdateSchema.safeParse(input)
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues.map((i) => i.message).join(', '),
        data: undefined,
      }
    }

    const existing = await prisma.project.findUnique({ where: { id } })
    if (!existing) return { success: false, error: 'Project not found', data: undefined }

    const { userId, ...data } = input
    const updateData: Prisma.ProjectUpdateInput = {
      ...data,
      updatedBy: session.userId,
      gallery: data.gallery !== undefined ? (data.gallery as unknown as Prisma.InputJsonValue) : undefined,
      tags: data.tags !== undefined ? (data.tags as unknown as Prisma.InputJsonValue) : undefined,
      architecture: data.architecture !== undefined ? (data.architecture as unknown as Prisma.InputJsonValue) : undefined,
      highlights: data.highlights !== undefined ? (data.highlights as unknown as Prisma.InputJsonValue) : undefined,
    }

    if (data.slug) {
      updateData.slug = slugify(data.slug)
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    })

    revalidateTag('projects', 'max')
    revalidatePath('/')
    revalidatePath('/projects')
    revalidatePath(`/projects/${project.slug}`)
    if (existing.slug !== project.slug) {
      revalidatePath(`/projects/${existing.slug}`)
    }

    return { success: true, data: project }
  } catch (error: any) {
    console.error('[updateProjectAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to update project', data: undefined }
  }
}

export async function softDeleteProjectAction(id: string) {
  try {
    const session = await checkAuth()
    const project = await prisma.project.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: session.userId,
      },
    })
    revalidateTag('projects', 'max')
    revalidatePath('/')
    revalidatePath('/projects')
    return { success: true, data: project }
  } catch (error: any) {
    console.error('[softDeleteProjectAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to delete project', data: undefined }
  }
}

export async function restoreProjectAction(id: string) {
  try {
    const session = await checkAuth()
    const project = await prisma.project.update({
      where: { id },
      data: {
        deletedAt: null,
        updatedBy: session.userId,
      },
    })
    revalidateTag('projects', 'max')
    revalidatePath('/')
    revalidatePath('/projects')
    return { success: true, data: project }
  } catch (error: any) {
    console.error('[restoreProjectAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to restore project', data: undefined }
  }
}

export async function duplicateProjectAction(id: string) {
  try {
    const session = await checkAuth()
    const existing = await prisma.project.findUnique({ where: { id } })
    if (!existing) return { success: false, error: 'Project not found', data: undefined }

    const copySlug = `${existing.slug}-copy-${Date.now().toString().slice(-4)}`
    const duplicate = await prisma.project.create({
      data: {
        title: `${existing.title} (Copy)`,
        slug: copySlug,
        subtitle: existing.subtitle,
        role: existing.role,
        timeline: existing.timeline,
        description: existing.description,
        content: existing.content,
        gallery: (existing.gallery as Prisma.InputJsonValue) ?? [],
        tags: (existing.tags as Prisma.InputJsonValue) ?? [],
        architecture: (existing.architecture as Prisma.InputJsonValue) ?? [],
        coreProblem: existing.coreProblem,
        highlights: (existing.highlights as Prisma.InputJsonValue) ?? [],
        codeSnippetFilename: existing.codeSnippetFilename,
        codeSnippetCode: existing.codeSnippetCode,
        githubUrl: existing.githubUrl,
        liveUrl: existing.liveUrl,
        stars: 0,
        forks: 0,
        status: ProjectStatus.DRAFT,
        featured: false,
        order: existing.order + 1,
        seoTitle: existing.seoTitle,
        seoDescription: existing.seoDescription,
        createdBy: session.userId,
      },
    })

    return { success: true, data: duplicate }
  } catch (error: any) {
    console.error('[duplicateProjectAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to duplicate project', data: undefined }
  }
}
