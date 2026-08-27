'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export interface OpenSourceFormInput {
  title: string
  number: number
  url: string
  repo: string
  repoUrl?: string
  status: 'MERGED' | 'OPEN'
  mergedAt?: string
  description?: string
  additions?: number
  deletions?: number
  order?: number
  featured?: boolean
}

export async function fetchOpenSourceContributionsAction() {
  try {
    const items = await prisma.openSourceContribution.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })

    return {
      success: true,
      items: items.map((item: any) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
    }
  } catch (error: any) {
    console.error('[fetchOpenSourceContributionsAction error]:', error)
    return { success: false, error: error.message || 'Failed to fetch open source contributions' }
  }
}

export async function createOpenSourceContributionAction(input: OpenSourceFormInput) {
  try {
    const created = await prisma.openSourceContribution.create({
      data: {
        title: input.title,
        number: Number(input.number),
        url: input.url,
        repo: input.repo,
        repoUrl: input.repoUrl || `https://github.com/${input.repo}`,
        status: input.status,
        mergedAt: input.mergedAt || null,
        description: input.description || null,
        additions: Number(input.additions || 0),
        deletions: Number(input.deletions || 0),
        order: Number(input.order || 0),
        featured: Boolean(input.featured),
      },
    })

    revalidatePath('/')
    revalidatePath('/admin/opensource')

    return { success: true, item: created }
  } catch (error: any) {
    console.error('[createOpenSourceContributionAction error]:', error)
    return { success: false, error: error.message || 'Failed to create contribution' }
  }
}

export async function updateOpenSourceContributionAction(
  id: string,
  input: Partial<OpenSourceFormInput>
) {
  try {
    const updated = await prisma.openSourceContribution.update({
      where: { id },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.number !== undefined && { number: Number(input.number) }),
        ...(input.url !== undefined && { url: input.url }),
        ...(input.repo !== undefined && { repo: input.repo }),
        ...(input.repoUrl !== undefined && { repoUrl: input.repoUrl }),
        ...(input.status !== undefined && { status: input.status }),
        ...(input.mergedAt !== undefined && { mergedAt: input.mergedAt }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.additions !== undefined && { additions: Number(input.additions) }),
        ...(input.deletions !== undefined && { deletions: Number(input.deletions) }),
        ...(input.order !== undefined && { order: Number(input.order) }),
        ...(input.featured !== undefined && { featured: Boolean(input.featured) }),
      },
    })

    revalidatePath('/')
    revalidatePath('/admin/opensource')

    return { success: true, item: updated }
  } catch (error: any) {
    console.error('[updateOpenSourceContributionAction error]:', error)
    return { success: false, error: error.message || 'Failed to update contribution' }
  }
}

export async function deleteOpenSourceContributionAction(id: string) {
  try {
    await prisma.openSourceContribution.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    revalidatePath('/')
    revalidatePath('/admin/opensource')

    return { success: true }
  } catch (error: any) {
    console.error('[deleteOpenSourceContributionAction error]:', error)
    return { success: false, error: error.message || 'Failed to delete contribution' }
  }
}

export async function reorderOpenSourceContributionsAction(
  items: Array<{ id: string; order: number }>
) {
  try {
    await prisma.$transaction(
      items.map((item) =>
        prisma.openSourceContribution.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    )

    revalidatePath('/')
    revalidatePath('/admin/opensource')

    return { success: true }
  } catch (error: any) {
    console.error('[reorderOpenSourceContributionsAction error]:', error)
    return { success: false, error: error.message || 'Failed to reorder' }
  }
}

const SEED_CONTRIBUTIONS: OpenSourceFormInput[] = [
  {
    title: 'optimize(turbopack): improve module graph resolution cache hit rate for dynamic imports',
    number: 64210,
    url: 'https://github.com/vercel/next.js/pull/64210',
    repo: 'vercel/next.js',
    repoUrl: 'https://github.com/vercel/next.js',
    status: 'MERGED',
    mergedAt: 'Mar 2026',
    description:
      'Refactored module tree traversal in the Turbopack dev bundling pipeline to avoid redundant re-evaluations on nested dynamic chunks.',
    additions: 142,
    deletions: 38,
    order: 0,
    featured: true,
  },
  {
    title: 'fix(router): prevent state de-synchronization during parallel route transitions',
    number: 61984,
    url: 'https://github.com/vercel/next.js/pull/61984',
    repo: 'vercel/next.js',
    repoUrl: 'https://github.com/vercel/next.js',
    status: 'MERGED',
    mergedAt: 'Jan 2026',
    description:
      'Resolved an edge case in Next.js App Router where parallel route slots would retain stale history snapshots during rapid navigation.',
    additions: 58,
    deletions: 14,
    order: 1,
    featured: false,
  },
  {
    title: 'feat(client-cache): implement configurable stale-while-revalidate duration on client router cache',
    number: 65302,
    url: 'https://github.com/vercel/next.js/pull/65302',
    repo: 'vercel/next.js',
    repoUrl: 'https://github.com/vercel/next.js',
    status: 'OPEN',
    description:
      'Adds router configuration options to customize in-memory page transition cache invalidation timers.',
    additions: 89,
    deletions: 22,
    order: 2,
    featured: false,
  },
  {
    title: 'fix(oxide): optimize CSS rule deduplication during JIT compiler pass',
    number: 13890,
    url: 'https://github.com/tailwindlabs/tailwindcss/pull/13890',
    repo: 'tailwindlabs/tailwindcss',
    repoUrl: 'https://github.com/tailwindlabs/tailwindcss',
    status: 'MERGED',
    mergedAt: 'Feb 2026',
    description:
      'Improved Rust AST parsing performance when compiling complex selector chains with dynamic variants in Tailwind CSS v4.',
    additions: 64,
    deletions: 19,
    order: 3,
    featured: true,
  },
  {
    title: 'feat(theme): add container query unit presets and fluid sizing helpers',
    number: 14102,
    url: 'https://github.com/tailwindlabs/tailwindcss/pull/14102',
    repo: 'tailwindlabs/tailwindcss',
    repoUrl: 'https://github.com/tailwindlabs/tailwindcss',
    status: 'OPEN',
    description:
      'Introduces standard @container utility aliases and auto-clamp helper tokens for responsive sub-component layouts.',
    additions: 112,
    deletions: 35,
    order: 4,
    featured: false,
  },
  {
    title: 'perf(client): batch connection pool health checks on engine startup',
    number: 24115,
    url: 'https://github.com/prisma/prisma/pull/24115',
    repo: 'prisma/prisma',
    repoUrl: 'https://github.com/prisma/prisma',
    status: 'MERGED',
    mergedAt: 'Dec 2025',
    description:
      'Optimized PostgreSQL connection pool handshake verification to run concurrent probes on cold boot, reducing initial latency.',
    additions: 92,
    deletions: 45,
    order: 5,
    featured: false,
  },
  {
    title: 'fix(compiler): retain hook memoization flags across nested ternary expressions',
    number: 28412,
    url: 'https://github.com/facebook/react/pull/28412',
    repo: 'facebook/react',
    repoUrl: 'https://github.com/facebook/react',
    status: 'MERGED',
    mergedAt: 'Nov 2025',
    description:
      'Fixed a compiler edge case where the React Compiler optimizer could unnecessarily invalidate useMemo blocks with multi-branch ternaries.',
    additions: 48,
    deletions: 12,
    order: 6,
    featured: true,
  },
]

export async function seedOpenSourceContributionsAction() {
  try {
    const existing = await prisma.openSourceContribution.count({
      where: { deletedAt: null },
    })

    if (existing > 0) {
      return { success: false, error: 'Database already has open source contributions.' }
    }

    await prisma.openSourceContribution.createMany({
      data: SEED_CONTRIBUTIONS.map((c) => ({
        title: c.title,
        number: c.number,
        url: c.url,
        repo: c.repo,
        repoUrl: c.repoUrl || `https://github.com/${c.repo}`,
        status: c.status,
        mergedAt: c.mergedAt || null,
        description: c.description || null,
        additions: c.additions || 0,
        deletions: c.deletions || 0,
        order: c.order || 0,
        featured: c.featured || false,
      })),
    })

    revalidatePath('/')
    revalidatePath('/admin/opensource')

    return { success: true, count: SEED_CONTRIBUTIONS.length }
  } catch (error: any) {
    console.error('[seedOpenSourceContributionsAction error]:', error)
    return { success: false, error: error.message || 'Failed to seed contributions' }
  }
}
