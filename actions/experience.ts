'use server'

import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import { experienceSchema } from '@/lib/validations'

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized session. Please log in again.')
  return session
}

export async function fetchExperiencesAction() {
  try {
    const items = await prisma.experience.findMany({
      where: { deletedAt: null },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    return { success: true, items }
  } catch (error: any) {
    console.error('[fetchExperiencesAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to fetch experiences', items: [] }
  }
}

export async function createExperienceAction(data: any) {
  try {
    const session = await checkAuth()
    const validation = experienceSchema.safeParse(data)
    if (!validation.success) {
      return { success: false, error: validation.error.issues.map((i) => i.message).join(', ') }
    }

    const val = validation.data
    const item = await prisma.experience.create({
      data: {
        company: val.company,
        role: val.role,
        location: val.location || null,
        employmentType: val.employmentType,
        startDate: val.startDate,
        endDate: val.endDate || null,
        currentJob: val.currentJob,
        description: val.description,
        responsibilities: val.responsibilities as any,
        technologies: val.technologies as any,
        companyLogo: val.companyLogo || null,
        order: val.order,
        createdBy: session.userId,
      },
    })

    revalidatePath('/')
    revalidatePath('/experience')

    return { success: true, data: item }
  } catch (error: any) {
    console.error('[createExperienceAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to create experience entry' }
  }
}

export async function updateExperienceAction(id: string, data: any) {
  try {
    const session = await checkAuth()
    const validation = experienceSchema.partial().safeParse(data)
    if (!validation.success) {
      return { success: false, error: validation.error.issues.map((i) => i.message).join(', ') }
    }

    const val = validation.data
    const item = await prisma.experience.update({
      where: { id },
      data: {
        ...val,
        responsibilities: val.responsibilities !== undefined ? (val.responsibilities as any) : undefined,
        technologies: val.technologies !== undefined ? (val.technologies as any) : undefined,
        updatedBy: session.userId,
      },
    })

    revalidatePath('/')
    revalidatePath('/experience')

    return { success: true, data: item }
  } catch (error: any) {
    console.error('[updateExperienceAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to update experience entry' }
  }
}

export async function softDeleteExperienceAction(id: string) {
  try {
    const session = await checkAuth()
    const item = await prisma.experience.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: session.userId,
      },
    })

    revalidatePath('/')
    revalidatePath('/experience')

    return { success: true, data: item }
  } catch (error: any) {
    console.error('[softDeleteExperienceAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to delete experience' }
  }
}
