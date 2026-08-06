'use server'

import { developmentService } from '@/services/development.service'
import { getAdminSession } from '@/lib/session'

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized session. Please log in again.')
  return session
}

export async function fetchDevelopmentItemsAction() {
  try {
    return await developmentService.getDevelopmentItems()
  } catch (error: any) {
    console.error('[fetchDevelopmentItemsAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to fetch development setups', items: [] }
  }
}

export async function createDevelopmentItemAction(data: any) {
  try {
    const session = await checkAuth()
    return await developmentService.createDevelopmentItem({ ...data, userId: session.userId })
  } catch (error: any) {
    console.error('[createDevelopmentItemAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to create development setup entry' }
  }
}

export async function updateDevelopmentItemAction(id: string, data: any) {
  try {
    const session = await checkAuth()
    return await developmentService.updateDevelopmentItem(id, { ...data, userId: session.userId })
  } catch (error: any) {
    console.error('[updateDevelopmentItemAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to update development entry' }
  }
}

export async function softDeleteDevelopmentItemAction(id: string) {
  try {
    const session = await checkAuth()
    return await developmentService.softDeleteDevelopmentItem(id, session.userId)
  } catch (error: any) {
    console.error('[softDeleteDevelopmentItemAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to delete development entry' }
  }
}
