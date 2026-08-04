'use server'

import { certificationService } from '@/services/certification.service'
import { getAdminSession } from '@/lib/session'

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized')
  return session
}

export async function fetchCertificationsAction() {
  return certificationService.getCertifications()
}

export async function createCertificationAction(data: {
  title: string
  issuer: string
  issueDate: string
  credentialUrl?: string
  credentialId?: string
  certificateImage?: string
  skills?: string[]
  featured?: boolean
  order?: number
}) {
  const session = await checkAuth()
  return certificationService.createCertification({ ...data, userId: session.userId })
}

export async function updateCertificationAction(id: string, data: any) {
  const session = await checkAuth()
  return certificationService.updateCertification(id, { ...data, userId: session.userId })
}

export async function softDeleteCertificationAction(id: string) {
  const session = await checkAuth()
  return certificationService.softDeleteCertification(id, session.userId)
}
