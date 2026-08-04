import { projectRepository, ProjectFindOptions } from '@/repositories/project.repository'
import { ProjectStatus, Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/utils'

export class ProjectService {
  async getProjects(options: ProjectFindOptions = {}) {
    try {
      const result = await projectRepository.findMany(options)
      return { success: true, ...result }
    } catch (error) {
      return { success: false, error: 'Failed to fetch projects', items: [], total: 0 }
    }
  }

  async getProjectBySlug(slug: string, includeDeleted = false) {
    try {
      const project = await projectRepository.findBySlug(slug, includeDeleted)
      if (!project) return { success: false, error: 'Project not found' }
      return { success: true, data: project }
    } catch (error) {
      return { success: false, error: 'Failed to fetch project' }
    }
  }

  async getProjectById(id: string) {
    try {
      const project = await projectRepository.findById(id)
      if (!project) return { success: false, error: 'Project not found' }
      return { success: true, data: project }
    } catch (error) {
      return { success: false, error: 'Failed to fetch project' }
    }
  }

  async createProject(input: {
    title: string
    slug?: string
    subtitle?: string
    role?: string
    timeline?: string
    description: string
    content?: string
    thumbnail?: string
    gallery?: string[]
    tags?: string[]
    architecture?: string[]
    coreProblem?: string
    highlights?: string[]
    codeSnippetFilename?: string
    codeSnippetCode?: string
    githubUrl?: string
    liveUrl?: string
    stars?: number
    forks?: number
    status?: ProjectStatus
    featured?: boolean
    order?: number
    seoTitle?: string
    seoDescription?: string
    userId?: string
  }) {
    try {
      const targetSlug = input.slug ? slugify(input.slug) : slugify(input.title)
      
      // Check slug uniqueness
      const existing = await projectRepository.findBySlug(targetSlug, true)
      let finalSlug = targetSlug
      if (existing) {
        finalSlug = `${targetSlug}-${Date.now().toString().slice(-4)}`
      }

      const createData: Prisma.ProjectCreateInput = {
        title: input.title,
        slug: finalSlug,
        subtitle: input.subtitle,
        role: input.role,
        timeline: input.timeline,
        description: input.description,
        content: input.content || '',
        thumbnail: input.thumbnail,
        gallery: JSON.stringify(input.gallery || []),
        tags: JSON.stringify(input.tags || []),
        architecture: JSON.stringify(input.architecture || []),
        coreProblem: input.coreProblem,
        highlights: JSON.stringify(input.highlights || []),
        codeSnippetFilename: input.codeSnippetFilename,
        codeSnippetCode: input.codeSnippetCode,
        githubUrl: input.githubUrl,
        liveUrl: input.liveUrl,
        stars: input.stars || 0,
        forks: input.forks || 0,
        status: input.status || ProjectStatus.DRAFT,
        featured: input.featured ?? false,
        order: input.order || 0,
        seoTitle: input.seoTitle,
        seoDescription: input.seoDescription,
        createdBy: input.userId,
      }

      const project = await projectRepository.create(createData)

      // Revalidate Next.js cache
      revalidatePath('/')
      revalidatePath('/projects')
      revalidatePath(`/projects/${project.slug}`)

      return { success: true, data: project }
    } catch (error) {
      return { success: false, error: 'Failed to create project' }
    }
  }

  async updateProject(
    id: string,
    input: Partial<{
      title: string
      slug: string
      subtitle: string
      role: string
      timeline: string
      description: string
      content: string
      thumbnail: string
      gallery: string[]
      tags: string[]
      architecture: string[]
      coreProblem: string
      highlights: string[]
      codeSnippetFilename: string
      codeSnippetCode: string
      githubUrl: string
      liveUrl: string
      stars: number
      forks: number
      status: ProjectStatus
      featured: boolean
      order: number
      seoTitle: string
      seoDescription: string
      userId: string
    }>
  ) {
    try {
      const existing = await projectRepository.findById(id)
      if (!existing) return { success: false, error: 'Project not found' }

      const { userId, ...data } = input

      const updateData: Prisma.ProjectUpdateInput = {
        ...data,
        updatedBy: userId,
        gallery: input.gallery ? JSON.stringify(input.gallery) : undefined,
        tags: input.tags ? JSON.stringify(input.tags) : undefined,
        architecture: input.architecture ? JSON.stringify(input.architecture) : undefined,
        highlights: input.highlights ? JSON.stringify(input.highlights) : undefined,
      }

      if (input.slug) {
        updateData.slug = slugify(input.slug)
      }

      const project = await projectRepository.update(id, updateData)

      // Revalidate cache
      revalidatePath('/')
      revalidatePath('/projects')
      revalidatePath(`/projects/${project.slug}`)
      if (existing.slug !== project.slug) {
        revalidatePath(`/projects/${existing.slug}`)
      }

      return { success: true, data: project }
    } catch (error) {
      console.error('Error updating project:', error)
      return { success: false, error: 'Failed to update project' }
    }
  }

  async softDeleteProject(id: string, userId?: string) {
    try {
      const project = await projectRepository.softDelete(id, userId)
      revalidatePath('/')
      revalidatePath('/projects')
      return { success: true, data: project }
    } catch (error) {
      return { success: false, error: 'Failed to delete project' }
    }
  }

  async restoreProject(id: string, userId?: string) {
    try {
      const project = await projectRepository.restore(id, userId)
      revalidatePath('/')
      revalidatePath('/projects')
      return { success: true, data: project }
    } catch (error) {
      return { success: false, error: 'Failed to restore project' }
    }
  }

  async duplicateProject(id: string, userId?: string) {
    try {
      const existing = await projectRepository.findById(id)
      if (!existing) return { success: false, error: 'Project not found' }

      const copySlug = `${existing.slug}-copy-${Date.now().toString().slice(-4)}`

      const duplicateData: Prisma.ProjectCreateInput = {
        title: `${existing.title} (Copy)`,
        slug: copySlug,
        subtitle: existing.subtitle,
        role: existing.role,
        timeline: existing.timeline,
        description: existing.description,
        content: existing.content,
        gallery: (existing.gallery as Prisma.InputJsonValue) ?? '[]',
        tags: (existing.tags as Prisma.InputJsonValue) ?? '[]',
        architecture: (existing.architecture as Prisma.InputJsonValue) ?? '[]',
        coreProblem: existing.coreProblem,
        highlights: (existing.highlights as Prisma.InputJsonValue) ?? '[]',
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
      return { success: false, error: 'Failed to duplicate project' }
    }
  }
}

export const projectService = new ProjectService()
