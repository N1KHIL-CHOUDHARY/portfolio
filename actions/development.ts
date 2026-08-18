'use server'

import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'
import { revalidatePath, revalidateTag } from 'next/cache'
import { slugify } from '@/lib/utils'
import { developmentSetupSchema } from '@/lib/validations'

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized session. Please log in again.')
  return session
}

export async function fetchDevelopmentItemsAction() {
  try {
    const items = await prisma.developmentSetup.findMany({
      where: { deletedAt: null },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    return { success: true, items }
  } catch (error: any) {
    console.error('[fetchDevelopmentItemsAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to fetch development setups', items: [] }
  }
}

export async function createDevelopmentItemAction(data: any) {
  try {
    const session = await checkAuth()
    const validation = developmentSetupSchema.safeParse(data)
    if (!validation.success) {
      return { success: false, error: validation.error.issues.map((i: any) => i.message).join(', ') }
    }

    const val = validation.data
    const targetSlug = val.slug ? slugify(val.slug) : slugify(val.title)
    const existing = await prisma.developmentSetup.findFirst({ where: { slug: targetSlug } })
    const finalSlug = existing ? `${targetSlug}-${Date.now().toString().slice(-4)}` : targetSlug

    const createData: any = {
      title: val.title,
      slug: finalSlug,
      subtitle: val.subtitle || null,
      category: val.category,
      whyIUseIt: val.whyIUseIt,
      content: val.content || '',
      tags: val.tags as any,
      specs: val.specs as any,
      configSnippetFilename: val.configSnippetFilename || null,
      configSnippetCode: val.configSnippetCode || null,
      links: val.links as any,
      laptop: val.laptop || null,
      desktop: val.desktop || null,
      keyboard: val.keyboard || null,
      mouse: val.mouse || null,
      monitor: val.monitor || null,
      microphone: val.microphone || null,
      camera: val.camera || null,
      chair: val.chair || null,
      ide: val.ide || null,
      extensions: val.extensions || null,
      terminal: val.terminal || null,
      browser: val.browser || null,
      wallpaper: val.wallpaper || null,
      productivityApps: val.productivityApps || null,
      image: val.image || null,
      affiliateLink: val.affiliateLink || null,
      order: val.order,
      createdBy: session.userId,
    }

    const item = await prisma.developmentSetup.create({
      data: createData,
    })

    revalidateTag('development', 'max')
    revalidatePath('/')
    revalidatePath('/development')
    revalidatePath(`/development/${item.slug}`)

    return { success: true, data: item }
  } catch (error: any) {
    console.error('[createDevelopmentItemAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to create development setup entry' }
  }
}

export async function updateDevelopmentItemAction(id: string, data: any) {
  try {
    const session = await checkAuth()
    const validation = developmentSetupSchema.partial().safeParse(data)
    if (!validation.success) {
      return { success: false, error: validation.error.issues.map((i: any) => i.message).join(', ') }
    }

    const val = validation.data
    const updateData: any = {
      ...val,
      tags: val.tags !== undefined ? (val.tags as any) : undefined,
      specs: val.specs !== undefined ? (val.specs as any) : undefined,
      links: val.links !== undefined ? (val.links as any) : undefined,
      updatedBy: session.userId,
    }

    if (val.slug) {
      updateData.slug = slugify(val.slug)
    }

    const item = await prisma.developmentSetup.update({
      where: { id },
      data: updateData,
    })

    revalidateTag('development', 'max')
    revalidatePath('/')
    revalidatePath('/development')
    revalidatePath(`/development/${item.slug}`)

    return { success: true, data: item }
  } catch (error: any) {
    console.error('[updateDevelopmentItemAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to update development entry' }
  }
}

export async function softDeleteDevelopmentItemAction(id: string) {
  try {
    const session = await checkAuth()
    const item = await prisma.developmentSetup.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: session.userId,
      },
    })

    revalidateTag('development', 'max')
    revalidatePath('/')
    revalidatePath('/development')

    return { success: true, data: item }
  } catch (error: any) {
    console.error('[softDeleteDevelopmentItemAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to delete development entry' }
  }
}
