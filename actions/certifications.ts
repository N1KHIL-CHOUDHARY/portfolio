'use server'

import { certificationService } from '@/services/certification.service'
import { getAdminSession } from '@/lib/session'

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized session. Please log in again.')
  return session
}

export async function fetchCertificationsAction() {
  try {
    return await certificationService.getCertifications()
  } catch (error: any) {
    console.error('[fetchCertificationsAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to fetch certifications', items: [] }
  }
}

export async function createCertificationAction(data: any) {
  try {
    const session = await checkAuth()
    return await certificationService.createCertification({ ...data, userId: session.userId })
  } catch (error: any) {
    console.error('[createCertificationAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to create certification' }
  }
}

export async function updateCertificationAction(id: string, data: any) {
  try {
    const session = await checkAuth()
    return await certificationService.updateCertification(id, { ...data, userId: session.userId })
  } catch (error: any) {
    console.error('[updateCertificationAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to update certification' }
  }
}

export async function softDeleteCertificationAction(id: string) {
  try {
    const session = await checkAuth()
    return await certificationService.softDeleteCertification(id, session.userId)
  } catch (error: any) {
    console.error('[softDeleteCertificationAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to delete certification' }
  }
}
