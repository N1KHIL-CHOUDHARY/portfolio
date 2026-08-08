'use server'

import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import { seoSchema } from '@/lib/validations'

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized session. Please log in again.')
  return session
}

export async function fetchSeoAction() {
  try {
    const data = await prisma.seoSetting.findFirst()
    return { success: true, data }
  } catch (error: any) {
    console.error('[fetchSeoAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to fetch SEO settings', data: undefined }
  }
}

export async function updateSeoAction(input: any) {
  try {
    const session = await checkAuth()
    const validation = seoSchema.safeParse(input)
    if (!validation.success) {
      return { success: false, error: validation.error.issues.map((i) => i.message).join(', ') }
    }

    const data = {
      ...validation.data,
      updatedBy: session.userId,
    }

    const existing = await prisma.seoSetting.findFirst()
    let res
    if (existing) {
      res = await prisma.seoSetting.update({ where: { id: existing.id }, data })
    } else {
      res = await prisma.seoSetting.create({ data: data as any })
    }

    revalidatePath('/')

    return { success: true, data: res }
  } catch (error: any) {
    console.error('[updateSeoAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to update SEO settings', data: undefined }
  }
}
