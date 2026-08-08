'use server'

import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import { experienceSchema, educationSchema } from '@/lib/validations'

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized session. Please log in again.')
  return session
}

// ================= WORK EXPERIENCE ACTIONS =================

export async function fetchExperiencesAction() {
  try {
    const items = await prisma.experience.findMany({
      where: { deletedAt: null },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    const formatted = items.map((item: any) => ({
      ...item,
      logoUrl: item.logoUrl || item.companyLogo || null,
      companyLogo: item.companyLogo || item.logoUrl || null,
    }))
    return { success: true, items: formatted }
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
    const logoValue = val.logoUrl || val.companyLogo || null
    const item = await prisma.experience.create({
      data: {
        company: val.company,
        role: val.role,
        location: val.location || null,
        employmentType: val.employmentType ?? 'FULL_TIME' as any,
        startDate: val.startDate || '',
        endDate: val.endDate || null,
        currentJob: val.currentJob ?? false,
        description: val.description || '',
        responsibilities: JSON.stringify(val.responsibilities ?? []),
        technologies: JSON.stringify(val.technologies ?? []),
        subRoles: JSON.stringify(val.subRoles ?? []),
        projects: JSON.stringify(val.projects ?? []),
        logoType: val.logoType || 'custom',
        companyLogo: logoValue,
        order: val.order ?? 0,
        createdBy: session.userId,
      },
    })

    revalidatePath('/')
    revalidatePath('/admin/experience')

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
    const logoValue = val.logoUrl !== undefined ? val.logoUrl : val.companyLogo
    const { logoUrl: _ignored, ...cleanVal } = val as any

    const item = await prisma.experience.update({
      where: { id },
      data: {
        ...cleanVal,
        companyLogo: logoValue !== undefined ? (logoValue || null) : undefined,
        responsibilities: val.responsibilities !== undefined ? JSON.stringify(val.responsibilities) : undefined,
        technologies: val.technologies !== undefined ? JSON.stringify(val.technologies) : undefined,
        subRoles: val.subRoles !== undefined ? JSON.stringify(val.subRoles) : undefined,
        projects: val.projects !== undefined ? JSON.stringify(val.projects) : undefined,
        updatedBy: session.userId,
      },
    })

    revalidatePath('/')
    revalidatePath('/admin/experience')

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
    revalidatePath('/admin/experience')

    return { success: true, data: item }
  } catch (error: any) {
    console.error('[softDeleteExperienceAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to delete experience' }
  }
}

// ================= EDUCATION ACTIONS =================

export async function fetchEducationsAction() {
  try {
    const items = await (prisma as any).education.findMany({
      where: { deletedAt: null },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    return { success: true, items }
  } catch (error: any) {
    console.error('[fetchEducationsAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to fetch educations', items: [] }
  }
}

export async function createEducationAction(data: any) {
  try {
    const session = await checkAuth()
    const validation = educationSchema.safeParse(data)
    if (!validation.success) {
      return { success: false, error: validation.error.issues.map((i) => i.message).join(', ') }
    }

    const val = validation.data
    const item = await (prisma as any).education.create({
      data: {
        institution: val.institution,
        degree: val.degree,
        location: val.location || null,
        startDate: val.startDate || '',
        endDate: val.endDate || null,
        currentStudy: val.currentStudy ?? false,
        description: val.description || '',
        bullets: JSON.stringify(val.bullets ?? []),
        projects: JSON.stringify(val.projects ?? []),
        logoType: val.logoType || 'custom',
        logoUrl: val.logoUrl || null,
        order: val.order ?? 0,
        createdBy: session.userId,
      },
    })

    revalidatePath('/')
    revalidatePath('/admin/experience')

    return { success: true, data: item }
  } catch (error: any) {
    console.error('[createEducationAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to create education entry' }
  }
}

export async function updateEducationAction(id: string, data: any) {
  try {
    const session = await checkAuth()
    const validation = educationSchema.partial().safeParse(data)
    if (!validation.success) {
      return { success: false, error: validation.error.issues.map((i) => i.message).join(', ') }
    }

    const val = validation.data
    const item = await (prisma as any).education.update({
      where: { id },
      data: {
        ...val,
        bullets: val.bullets !== undefined ? JSON.stringify(val.bullets) : undefined,
        projects: val.projects !== undefined ? JSON.stringify(val.projects) : undefined,
        updatedBy: session.userId,
      },
    })

    revalidatePath('/')
    revalidatePath('/admin/experience')

    return { success: true, data: item }
  } catch (error: any) {
    console.error('[updateEducationAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to update education entry' }
  }
}

export async function softDeleteEducationAction(id: string) {
  try {
    const session = await checkAuth()
    const item = await (prisma as any).education.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: session.userId,
      },
    })

    revalidatePath('/')
    revalidatePath('/admin/experience')

    return { success: true, data: item }
  } catch (error: any) {
    console.error('[softDeleteEducationAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to delete education entry' }
  }
}
