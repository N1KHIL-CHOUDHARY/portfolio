'use server'

import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const gearSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional().nullable(),
  category: z.string().min(1, 'Category is required'),
  link: z.string().min(1, 'Product link is required'),
  description: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  specs: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  order: z.number().default(0),
})

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized session. Please log in again.')
  return session
}

export async function fetchGearsAction() {
  try {
    const gearModel = prisma.gear || (prisma as any).gear
    const items = await gearModel.findMany({
      where: { deletedAt: null },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    return { success: true, items }
  } catch (error: any) {
    console.error('[fetchGearsAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to fetch gears', items: [] }
  }
}

export async function createGearAction(input: any) {
  try {
    const session = await checkAuth()
    const validation = gearSchema.safeParse(input)
    if (!validation.success) {
      return { success: false, error: validation.error.issues.map((i: any) => i.message).join(', ') }
    }

    const { title, subtitle, category, link, description, tags, specs, order } = validation.data
    const gearModel = prisma.gear || (prisma as any).gear
    const item = await gearModel.create({
      data: {
        title,
        subtitle: subtitle || null,
        category,
        link,
        description: description || null,
        tags: tags as any,
        specs: specs as any,
        order,
        createdBy: session.userId,
      },
    })

    revalidatePath('/')
    revalidatePath('/gears')
    revalidatePath('/admin/gears')

    return { success: true, data: item }
  } catch (error: any) {
    console.error('[createGearAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to create gear item' }
  }
}

export async function updateGearAction(id: string, input: any) {
  try {
    const session = await checkAuth()
    const validation = gearSchema.partial().safeParse(input)
    if (!validation.success) {
      return { success: false, error: validation.error.issues.map((i: any) => i.message).join(', ') }
    }

    const data = validation.data
    const gearModel = prisma.gear || (prisma as any).gear
    const item = await gearModel.update({
      where: { id },
      data: {
        ...data,
        tags: data.tags !== undefined ? (data.tags as any) : undefined,
        specs: data.specs !== undefined ? (data.specs as any) : undefined,
        updatedBy: session.userId,
      },
    })

    revalidatePath('/')
    revalidatePath('/gears')
    revalidatePath('/admin/gears')

    return { success: true, data: item }
  } catch (error: any) {
    console.error('[updateGearAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to update gear item' }
  }
}

export async function softDeleteGearAction(id: string) {
  try {
    const session = await checkAuth()
    const gearModel = prisma.gear || (prisma as any).gear
    const item = await gearModel.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: session.userId,
      },
    })

    revalidatePath('/')
    revalidatePath('/gears')
    revalidatePath('/admin/gears')

    return { success: true, data: item }
  } catch (error: any) {
    console.error('[softDeleteGearAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to delete gear item' }
  }
}
