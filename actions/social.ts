'use server'

import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import { socialSchema } from '@/lib/validations'

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized session. Please log in again.')
  return session
}

export async function fetchSocialsAction() {
  try {
    const items = await prisma.socialLink.findMany({
      where: { deletedAt: null },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    return { success: true, items }
  } catch (error: any) {
    console.error('[fetchSocialsAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to fetch social links', items: [] }
  }
}

export async function saveSocialAction(id: string | undefined, data: any) {
  try {
    const session = await checkAuth()
    const validation = socialSchema.safeParse(data)
    if (!validation.success) {
      return { success: false, error: validation.error.issues.map((i) => i.message).join(', ') }
    }

    const val = validation.data
    let item
    if (id) {
      item = await prisma.socialLink.update({
        where: { id },
        data: {
          platform: val.platform,
          url: val.url,
          label: val.label,
          icon: val.icon || null,
          order: val.order,
          enabled: val.enabled,
          updatedBy: session.userId,
        },
      })
    } else {
      item = await prisma.socialLink.create({
        data: {
          platform: val.platform,
          url: val.url,
          label: val.label,
          icon: val.icon || null,
          order: val.order,
          enabled: val.enabled,
          createdBy: session.userId,
        },
      })
    }

    revalidatePath('/')

    return { success: true, data: item }
  } catch (error: any) {
    console.error('[saveSocialAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to save social link' }
  }
}

export async function deleteSocialAction(id: string) {
  try {
    const session = await checkAuth()
    const item = await prisma.socialLink.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: session.userId,
      },
    })

    revalidatePath('/')

    return { success: true, data: item }
  } catch (error: any) {
    console.error('[deleteSocialAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to delete social link' }
  }
}
