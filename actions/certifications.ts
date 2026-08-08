'use server'

import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import { certificationSchema } from '@/lib/validations'

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized session. Please log in again.')
  return session
}

export async function fetchCertificationsAction() {
  try {
    const items = await prisma.certification.findMany({
      where: { deletedAt: null },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    return { success: true, items }
  } catch (error: any) {
    console.error('[fetchCertificationsAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to fetch certifications', items: [] }
  }
}

export async function createCertificationAction(data: any) {
  try {
    const session = await checkAuth()
    const validation = certificationSchema.safeParse(data)
    if (!validation.success) {
      return { success: false, error: validation.error.issues.map((i) => i.message).join(', ') }
    }

    const val = validation.data
    const item = await prisma.certification.create({
      data: {
        title: val.title,
        issuer: val.issuer,
        issueDate: val.issueDate,
        credentialUrl: val.credentialUrl || null,
        credentialId: val.credentialId || null,
        certificateImage: val.certificateImage || null,
        skills: val.skills as any,
        featured: val.featured,
        order: val.order,
        createdBy: session.userId,
      },
    })

    revalidatePath('/')
    revalidatePath('/certifications')

    return { success: true, data: item }
  } catch (error: any) {
    console.error('[createCertificationAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to create certification' }
  }
}

export async function updateCertificationAction(id: string, data: any) {
  try {
    const session = await checkAuth()
    const validation = certificationSchema.partial().safeParse(data)
    if (!validation.success) {
      return { success: false, error: validation.error.issues.map((i) => i.message).join(', ') }
    }

    const val = validation.data
    const item = await prisma.certification.update({
      where: { id },
      data: {
        ...val,
        skills: val.skills !== undefined ? (val.skills as any) : undefined,
        updatedBy: session.userId,
      },
    })

    revalidatePath('/')
    revalidatePath('/certifications')

    return { success: true, data: item }
  } catch (error: any) {
    console.error('[updateCertificationAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to update certification' }
  }
}

export async function softDeleteCertificationAction(id: string) {
  try {
    const session = await checkAuth()
    const item = await prisma.certification.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: session.userId,
      },
    })

    revalidatePath('/')
    revalidatePath('/certifications')

    return { success: true, data: item }
  } catch (error: any) {
    console.error('[softDeleteCertificationAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to delete certification' }
  }
}
