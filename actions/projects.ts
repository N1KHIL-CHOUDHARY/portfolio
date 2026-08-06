'use server'

import { projectService } from '@/services/project.service'
import { getAdminSession } from '@/lib/session'
import { ProjectStatus } from '@prisma/client'

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
}) {
  try {
    return await projectService.getProjects(options)
  } catch (error: any) {
    console.error('[fetchProjectsAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to fetch projects', items: [], total: 0 }
  }
}

export async function fetchProjectBySlugAction(slug: string) {
  try {
    return await projectService.getProjectBySlug(slug)
  } catch (error: any) {
    console.error('[fetchProjectBySlugAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to fetch project', data: undefined }
  }
}

export async function fetchProjectByIdAction(id: string) {
  try {
    return await projectService.getProjectById(id)
  } catch (error: any) {
    console.error('[fetchProjectByIdAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to fetch project', data: undefined }
  }
}

export async function createProjectAction(data: any) {
  try {
    const session = await checkAuth()
    return await projectService.createProject({ ...data, userId: session.userId })
  } catch (error: any) {
    console.error('[createProjectAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to create project', data: undefined }
  }
}

export async function updateProjectAction(id: string, data: any) {
  try {
    const session = await checkAuth()
    return await projectService.updateProject(id, { ...data, userId: session.userId })
  } catch (error: any) {
    console.error('[updateProjectAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to update project', data: undefined }
  }
}

export async function softDeleteProjectAction(id: string) {
  try {
    const session = await checkAuth()
    return await projectService.softDeleteProject(id, session.userId)
  } catch (error: any) {
    console.error('[softDeleteProjectAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to delete project', data: undefined }
  }
}

export async function restoreProjectAction(id: string) {
  try {
    const session = await checkAuth()
    return await projectService.restoreProject(id, session.userId)
  } catch (error: any) {
    console.error('[restoreProjectAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to restore project', data: undefined }
  }
}

export async function duplicateProjectAction(id: string) {
  try {
    const session = await checkAuth()
    return await projectService.duplicateProject(id, session.userId)
  } catch (error: any) {
    console.error('[duplicateProjectAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to duplicate project', data: undefined }
  }
}
