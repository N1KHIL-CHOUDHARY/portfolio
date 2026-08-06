import { projectRepository, ProjectFindOptions } from '@/repositories/project.repository'
import { ProjectStatus, Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/utils'
import { projectSchema, projectUpdateSchema } from '@/lib/validations'

function handlePrismaError(error: unknown, fallbackMsg: string): string {
  console.error('[ProjectService Error]:', error)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      return 'Project record not found or already deleted.'
    }
  }
  return error instanceof Error ? error.message : fallbackMsg
}

export class ProjectService {
  async getProjects(options: ProjectFindOptions = {}) {
    try {
      const result = await projectRepository.findMany(options)
      return { success: true, ...result }
    } catch (error) {
      return {
        success: false,
        error: handlePrismaError(error, 'Failed to fetch projects'),
        items: [],
        total: 0,
      }
    }
  }

  async getProjectBySlug(slug: string, includeDeleted = false) {
    try {
      const project = await projectRepository.findBySlug(slug, includeDeleted)
      if (!project) return { success: false, error: 'Project not found', data: undefined }
      return { success: true, data: project }
    } catch (error) {
      return { success: false, error: handlePrismaError(error, 'Failed to fetch project'), data: undefined }
    }
  }

  async getProjectById(id: string) {
    try {
      const project = await projectRepository.findById(id)
      if (!project) return { success: false, error: 'Project not found', data: undefined }
      return { success: true, data: project }
    } catch (error) {
      return { success: false, error: handlePrismaError(error, 'Failed to fetch project'), data: undefined }
    }
  }

  async createProject(input: any) {
    const validation = projectSchema.safeParse(input)
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues.map((i) => i.message).join(', '),
        data: undefined,
      }
    }

    const data = validation.data
    try {
      const targetSlug = data.slug ? slugify(data.slug) : slugify(data.title)

      // Check slug uniqueness
      const existing = await projectRepository.findBySlug(targetSlug, true)
      let finalSlug = targetSlug
      if (existing) {
        finalSlug = `${targetSlug}-${Date.now().toString().slice(-4)}`
      }

      const createData: Prisma.ProjectCreateInput = {
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
        createdBy: input.userId,
      }

      const project = await projectRepository.create(createData)

      revalidatePath('/')
      revalidatePath('/projects')
      revalidatePath(`/projects/${project.slug}`)

      return { success: true, data: project }
    } catch (error) {
      return { success: false, error: handlePrismaError(error, 'Failed to create project'), data: undefined }
    }
  }

  async updateProject(id: string, input: any) {
    const validation = projectUpdateSchema.safeParse(input)
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues.map((i) => i.message).join(', '),
        data: undefined,
      }
    }

    try {
      const existing = await projectRepository.findById(id)
      if (!existing) return { success: false, error: 'Project not found', data: undefined }

      const { userId, ...data } = input

      const updateData: Prisma.ProjectUpdateInput = {
        ...data,
        updatedBy: userId,
        gallery: data.gallery !== undefined ? (data.gallery as unknown as Prisma.InputJsonValue) : undefined,
        tags: data.tags !== undefined ? (data.tags as unknown as Prisma.InputJsonValue) : undefined,
        architecture: data.architecture !== undefined ? (data.architecture as unknown as Prisma.InputJsonValue) : undefined,
        highlights: data.highlights !== undefined ? (data.highlights as unknown as Prisma.InputJsonValue) : undefined,
      }

      if (data.slug) {
        updateData.slug = slugify(data.slug)
      }

      const project = await projectRepository.update(id, updateData)

      revalidatePath('/')
      revalidatePath('/projects')
      revalidatePath(`/projects/${project.slug}`)
      if (existing.slug !== project.slug) {
        revalidatePath(`/projects/${existing.slug}`)
      }

      return { success: true, data: project }
    } catch (error) {
      return { success: false, error: handlePrismaError(error, 'Failed to update project'), data: undefined }
    }
  }

  async softDeleteProject(id: string, userId?: string) {
    try {
      const project = await projectRepository.softDelete(id, userId)
      revalidatePath('/')
      revalidatePath('/projects')
      return { success: true, data: project }
    } catch (error) {
      return { success: false, error: handlePrismaError(error, 'Failed to delete project'), data: undefined }
    }
  }

  async restoreProject(id: string, userId?: string) {
    try {
      const project = await projectRepository.restore(id, userId)
      revalidatePath('/')
      revalidatePath('/projects')
      return { success: true, data: project }
    } catch (error) {
      return { success: false, error: handlePrismaError(error, 'Failed to restore project'), data: undefined }
    }
  }

  async duplicateProject(id: string, userId?: string) {
    try {
      const existing = await projectRepository.findById(id)
      if (!existing) return { success: false, error: 'Project not found', data: undefined }

      const copySlug = `${existing.slug}-copy-${Date.now().toString().slice(-4)}`

      const duplicateData: Prisma.ProjectCreateInput = {
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
        createdBy: userId,
      }

      const duplicate = await projectRepository.create(duplicateData)
      return { success: true, data: duplicate }
    } catch (error) {
      return { success: false, error: handlePrismaError(error, 'Failed to duplicate project'), data: undefined }
    }
  }
}

export const projectService = new ProjectService()
