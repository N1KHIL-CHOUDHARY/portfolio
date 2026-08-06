'use server'

import { skillService } from '@/services/skill.service'
import { getAdminSession } from '@/lib/session'

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized session. Please log in again.')
  return session
}

export async function fetchSkillsAction() {
  try {
    return await skillService.getSkills()
  } catch (error: any) {
    console.error('[fetchSkillsAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to fetch skills', items: [] }
  }
}

export async function createSkillAction(data: any) {
  try {
    const session = await checkAuth()
    return await skillService.createSkill({ ...data, userId: session.userId })
  } catch (error: any) {
    console.error('[createSkillAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to create skill' }
  }
}

export async function updateSkillAction(id: string, data: any) {
  try {
    const session = await checkAuth()
    return await skillService.updateSkill(id, { ...data, userId: session.userId })
  } catch (error: any) {
    console.error('[updateSkillAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to update skill' }
  }
}

export async function softDeleteSkillAction(id: string) {
  try {
    const session = await checkAuth()
    return await skillService.softDeleteSkill(id, session.userId)
  } catch (error: any) {
    console.error('[softDeleteSkillAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to delete skill' }
  }
}
