'use server'

import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'
import { revalidatePath, revalidateTag } from 'next/cache'
import { heroSchema } from '@/lib/validations'

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized session. Please log in again.')
  return session
}

export async function fetchHeroAction() {
  try {
    const data = await prisma.heroSetting.findFirst()
    return { success: true, data }
  } catch (error: any) {
    console.error('[fetchHeroAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to fetch hero settings', data: undefined }
  }
}

export async function updateHeroAction(input: any) {
  try {
    const session = await checkAuth()
    const validation = heroSchema.safeParse(input)
    if (!validation.success) {
      return { success: false, error: validation.error.issues.map((i) => i.message).join(', ') }
    }

    const data = {
      ...validation.data,
      ctaButtons: validation.data.ctaButtons as any,
      updatedBy: session.userId,
    }

    const existing = await prisma.heroSetting.findFirst()
    let res
    if (existing) {
      res = await prisma.heroSetting.update({ where: { id: existing.id }, data })
    } else {
      res = await prisma.heroSetting.create({ data: data as any })
    }

    revalidateTag('hero', 'max')
    revalidatePath('/')

    return { success: true, data: res }
  } catch (error: any) {
    console.error('[updateHeroAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to update hero settings', data: undefined }
  }
}
