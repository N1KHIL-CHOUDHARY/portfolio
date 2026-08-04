'use server'

import { projectService } from '@/services/project.service'
import { getAdminSession } from '@/lib/session'
import { ProjectStatus } from '@prisma/client'

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}

export async function fetchProjectsAction(options: {
  includeDeleted?: boolean
  status?: ProjectStatus
  search?: string
  page?: number
  limit?: number
}) {
  return projectService.getProjects(options)
}

export async function fetchProjectBySlugAction(slug: string) {
  return projectService.getProjectBySlug(slug)
}

export async function fetchProjectByIdAction(id: string) {
  return projectService.getProjectById(id)
}

export async function createProjectAction(data: {
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
}) {
  const session = await checkAuth()
  return projectService.createProject({ ...data, userId: session.userId })
}

export async function updateProjectAction(
  id: string,
  data: Partial<{
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
  }>
) {
  const session = await checkAuth()
  return projectService.updateProject(id, { ...data, userId: session.userId })
}

export async function softDeleteProjectAction(id: string) {
  const session = await checkAuth()
  return projectService.softDeleteProject(id, session.userId)
}

export async function restoreProjectAction(id: string) {
  const session = await checkAuth()
  return projectService.restoreProject(id, session.userId)
}

export async function duplicateProjectAction(id: string) {
  const session = await checkAuth()
  return projectService.duplicateProject(id, session.userId)
}
