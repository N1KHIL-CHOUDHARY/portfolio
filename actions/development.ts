'use server'

import { developmentService } from '@/services/development.service'
import { getAdminSession } from '@/lib/session'

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized')
  return session
}

export async function fetchDevelopmentItemsAction() {
  return developmentService.getDevelopmentItems()
}

export async function createDevelopmentItemAction(data: any) {
  const session = await checkAuth()
  return developmentService.createDevelopmentItem({ ...data, userId: session.userId })
}

export async function updateDevelopmentItemAction(id: string, data: any) {
  const session = await checkAuth()
  return developmentService.updateDevelopmentItem(id, { ...data, userId: session.userId })
}

export async function softDeleteDevelopmentItemAction(id: string) {
  const session = await checkAuth()
  return developmentService.softDeleteDevelopmentItem(id, session.userId)
}
