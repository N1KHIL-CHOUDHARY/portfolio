'use server'

import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'
import { revalidatePath, revalidateTag } from 'next/cache'
import { skillSchema } from '@/lib/validations'

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized session. Please log in again.')
  return session
}

export async function fetchSkillsAction() {
  try {
    const items = await prisma.skill.findMany({
      where: { deletedAt: null },
      orderBy: [{ category: 'asc' }, { order: 'asc' }, { name: 'asc' }],
    })
    return { success: true, items }
  } catch (error: any) {
    console.error('[fetchSkillsAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to fetch skills', items: [] }
  }
}

export async function createSkillAction(data: any) {
  try {
    const session = await checkAuth()
    const validation = skillSchema.safeParse(data)
    if (!validation.success) {
      return { success: false, error: validation.error.issues.map((i) => i.message).join(', ') }
    }

    const val = validation.data
    const item = await prisma.skill.create({
      data: {
        name: val.name,
        icon: val.icon || null,
        category: val.category,
        color: val.color || null,
        proficiency: val.proficiency,
        order: val.order,
        featured: val.featured,
        createdBy: session.userId,
      },
    })

    revalidateTag('skills', 'max')
    revalidatePath('/')

    return { success: true, data: item }
  } catch (error: any) {
    console.error('[createSkillAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to create skill' }
  }
}

export async function updateSkillAction(id: string, data: any) {
  try {
    const session = await checkAuth()
    const validation = skillSchema.partial().safeParse(data)
    if (!validation.success) {
      return { success: false, error: validation.error.issues.map((i) => i.message).join(', ') }
    }

    const val = validation.data
    const item = await prisma.skill.update({
      where: { id },
      data: {
        ...val,
        updatedBy: session.userId,
      },
    })

    revalidateTag('skills', 'max')
    revalidatePath('/')

    return { success: true, data: item }
  } catch (error: any) {
    console.error('[updateSkillAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to update skill' }
  }
}

export async function softDeleteSkillAction(id: string) {
  try {
    const session = await checkAuth()
    const item = await prisma.skill.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: session.userId,
      },
    })

    revalidateTag('skills', 'max')
    revalidatePath('/')

    return { success: true, data: item }
  } catch (error: any) {
    console.error('[softDeleteSkillAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to delete skill' }
  }
}
