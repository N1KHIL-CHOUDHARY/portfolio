'use server'

import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import { aboutSchema } from '@/lib/validations'

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized session. Please log in again.')
  return session
}

export async function fetchAboutAction() {
  try {
    const data = await prisma.aboutSetting.findFirst()
    return { success: true, data }
  } catch (error: any) {
    console.error('[fetchAboutAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to fetch about settings', data: undefined }
  }
}

export async function updateAboutAction(input: any) {
  try {
    const session = await checkAuth()
    const validation = aboutSchema.safeParse(input)
    if (!validation.success) {
      return { success: false, error: validation.error.issues.map((i) => i.message).join(', ') }
    }

    const data = {
      ...validation.data,
      customCards: validation.data.customCards as any,
      updatedBy: session.userId,
    }

    const existing = await prisma.aboutSetting.findFirst()
    let res
    if (existing) {
      res = await prisma.aboutSetting.update({ where: { id: existing.id }, data })
    } else {
      res = await prisma.aboutSetting.create({ data: data as any })
    }

    revalidatePath('/')

    return { success: true, data: res }
  } catch (error: any) {
    console.error('[updateAboutAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to update about settings', data: undefined }
  }
}
