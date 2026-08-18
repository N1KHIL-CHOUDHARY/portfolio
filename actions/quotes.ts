'use server'

import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'
import { revalidatePath, revalidateTag } from 'next/cache'
import { quoteSchema, bulkQuotesSchema } from '@/lib/validations'
import { getTodayQuote, getTodayQuoteRandom } from '@/lib/db'

async function checkAuth() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized session. Please log in again.')
  return session
}

export async function fetchQuotesAction() {
  try {
    const items = await prisma.quote.findMany({
      where: { deletedAt: null },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    })

    const activeItems = items.filter((q: any) => q.active)
    const dayNumber = Math.floor(Date.now() / (1000 * 60 * 60 * 24))
    const todayIndex = activeItems.length > 0 ? Math.abs(dayNumber) % activeItems.length : -1
    const todayQuoteId = todayIndex >= 0 ? activeItems[todayIndex]?.id : null

    return {
      success: true,
      items,
      todayQuoteId,
      todayIndex,
      totalCount: items.length,
      activeCount: activeItems.length,
    }
  } catch (error: any) {
    console.error('[fetchQuotesAction Error]:', error)
    return {
      success: false,
      error: error?.message || 'Failed to fetch quotes',
      items: [],
      todayQuoteId: null,
      todayIndex: -1,
      totalCount: 0,
      activeCount: 0,
    }
  }
}

export async function createQuoteAction(data: any) {
  try {
    const session = await checkAuth()
    const validation = quoteSchema.safeParse(data)
    if (!validation.success) {
      return { success: false, error: validation.error.issues.map((i) => i.message).join(', ') }
    }

    const val = validation.data

    // If order was not set or 0, calculate next sequential order
    let nextOrder = val.order
    if (nextOrder === undefined || nextOrder === 0) {
      const maxItem = await prisma.quote.findFirst({
        where: { deletedAt: null },
        orderBy: { order: 'desc' },
      })
      nextOrder = (maxItem?.order ?? -1) + 1
    }

    const item = await prisma.quote.create({
      data: {
        text: val.text.trim(),
        author: (val.author || 'Bhagavad Gita').trim(),
        order: nextOrder,
        category: val.category ? val.category.trim() : 'Wisdom',
        active: val.active ?? true,
        createdBy: session.userId,
      },
    })

    revalidateTag('quotes', 'max')
    revalidatePath('/')
    revalidatePath('/admin/quotes')

    return { success: true, data: item }
  } catch (error: any) {
    console.error('[createQuoteAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to create quote' }
  }
}

export async function updateQuoteAction(id: string, data: any) {
  try {
    const session = await checkAuth()
    const validation = quoteSchema.partial().safeParse(data)
    if (!validation.success) {
      return { success: false, error: validation.error.issues.map((i) => i.message).join(', ') }
    }

    const val = validation.data
    const updateData: any = {
      updatedBy: session.userId,
    }

    if (val.text !== undefined) updateData.text = val.text.trim()
    if (val.author !== undefined) updateData.author = val.author.trim()
    if (val.order !== undefined) updateData.order = val.order
    if (val.category !== undefined) updateData.category = val.category ? val.category.trim() : 'Wisdom'
    if (val.active !== undefined) updateData.active = val.active

    const item = await prisma.quote.update({
      where: { id },
      data: updateData,
    })

    revalidateTag('quotes', 'max')
    revalidatePath('/')
    revalidatePath('/admin/quotes')

    return { success: true, data: item }
  } catch (error: any) {
    console.error('[updateQuoteAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to update quote' }
  }
}

export async function toggleQuoteActiveAction(id: string, active: boolean) {
  try {
    const session = await checkAuth()
    const item = await prisma.quote.update({
      where: { id },
      data: {
        active,
        updatedBy: session.userId,
      },
    })

    revalidateTag('quotes', 'max')
    revalidatePath('/')
    revalidatePath('/admin/quotes')

    return { success: true, data: item }
  } catch (error: any) {
    console.error('[toggleQuoteActiveAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to toggle quote status' }
  }
}

export async function softDeleteQuoteAction(id: string) {
  try {
    const session = await checkAuth()
    const item = await prisma.quote.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: session.userId,
      },
    })

    revalidateTag('quotes', 'max')
    revalidatePath('/')
    revalidatePath('/admin/quotes')

    return { success: true, data: item }
  } catch (error: any) {
    console.error('[softDeleteQuoteAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to delete quote' }
  }
}

export async function bulkCreateQuotesAction(data: { quotes: Array<{ text: string; author?: string; category?: string }> }) {
  try {
    const session = await checkAuth()
    const validation = bulkQuotesSchema.safeParse(data)
    if (!validation.success) {
      return { success: false, error: validation.error.issues.map((i) => i.message).join(', ') }
    }

    const { quotes } = validation.data

    // Find current highest order index
    const maxItem = await prisma.quote.findFirst({
      where: { deletedAt: null },
      orderBy: { order: 'desc' },
    })
    let currentOrder = (maxItem?.order ?? -1) + 1

    const createPayload = quotes.map((q) => {
      const assignedOrder = q.order !== undefined ? q.order : currentOrder++
      return {
        text: q.text.trim(),
        author: (q.author || 'Bhagavad Gita').trim(),
        order: assignedOrder,
        category: q.category ? q.category.trim() : 'Wisdom',
        active: q.active ?? true,
        createdBy: session.userId,
      }
    })

    const count = await prisma.quote.createMany({
      data: createPayload,
    })

    revalidateTag('quotes', 'max')
    revalidatePath('/')
    revalidatePath('/admin/quotes')

    return { success: true, count: count.count }
  } catch (error: any) {
    console.error('[bulkCreateQuotesAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to bulk create quotes' }
  }
}

export async function reorderQuotesAction(items: { id: string; order: number }[]) {
  try {
    const session = await checkAuth()

    await prisma.$transaction(
      items.map((item) =>
        prisma.quote.update({
          where: { id: item.id },
          data: { order: item.order, updatedBy: session.userId },
        })
      )
    )

    revalidateTag('quotes', 'max')
    revalidatePath('/')
    revalidatePath('/admin/quotes')

    return { success: true }
  } catch (error: any) {
    console.error('[reorderQuotesAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to reorder quotes' }
  }
}

export async function fetchTodayQuoteAction(random: boolean = false) {
  try {
    const quote = random ? await getTodayQuoteRandom() : await getTodayQuote()
    return { success: true, quote }
  } catch (error: any) {
    console.error('[fetchTodayQuoteAction Error]:', error)
    return { success: false, error: error?.message || 'Failed to get today quote' }
  }
}
