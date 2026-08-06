'use server'

import { experienceService } from '@/services/experience.service'
import { getAdminSession } from '@/lib/session'

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized session. Please log in again.')
  return session
}

export async function fetchExperiencesAction() {
  try {
    return await experienceService.getExperiences()
  } catch (error: any) {
    console.error('[fetchExperiencesAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to fetch experiences', items: [] }
  }
}

export async function createExperienceAction(data: any) {
  try {
    const session = await checkAuth()
    return await experienceService.createExperience({ ...data, userId: session.userId })
  } catch (error: any) {
    console.error('[createExperienceAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to create experience entry' }
  }
}

export async function updateExperienceAction(id: string, data: any) {
  try {
    const session = await checkAuth()
    return await experienceService.updateExperience(id, { ...data, userId: session.userId })
  } catch (error: any) {
    console.error('[updateExperienceAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to update experience entry' }
  }
}

export async function softDeleteExperienceAction(id: string) {
  try {
    const session = await checkAuth()
    return await experienceService.softDeleteExperience(id, session.userId)
  } catch (error: any) {
    console.error('[softDeleteExperienceAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to delete experience' }
  }
}
