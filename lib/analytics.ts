import { redis } from '@/lib/redis'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export interface TrackViewParams {
  path: string
  visitorId?: string
  ip?: string | null
  userAgent?: string | null
  referrer?: string | null
  country?: string | null
  city?: string | null
}

export interface TrackViewResult {
  success: boolean
  isUnique: boolean
  totalViews: number
  uniqueVisitors: number
  pathViews: number
}

export interface PopularPageItem {
  path: string
  title?: string
  views: number
}

export interface AnalyticsSummary {
  totalViews: number
  uniqueVisitors: number
  todayViews: number
  todayUnique: number
  monthViews: number
  popularPages: PopularPageItem[]
  recentVisits: Array<{
    id: string
    path: string
    visitorHash: string
    referrer: string | null
    userAgent: string | null
    isUnique: boolean
    createdAt: Date
  }>
  redisConnected: boolean
  dbConnected: boolean
  lastSyncedAt: Date | string
}

/**
 * Generate a consistent SHA-256 hash for a visitor to preserve privacy
 */
export function generateVisitorHash(ip: string = '', userAgent: string = '', visitorId: string = ''): string {
  const raw = `${ip}::${userAgent}::${visitorId}`
  return crypto.createHash('sha256').update(raw).digest('hex').substring(0, 32)
}

/**
 * Filter out common web crawlers and administrative paths
 */
export function shouldIgnoreTracking(path: string, userAgent: string = ''): boolean {
  if (!path) return true

  // Ignore admin endpoints, api routes, static assets, and icon files
  const ignoredPrefixes = [
    '/admin',
    '/api',
    '/_next',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/icon.',
    '/images/',
    '/RESUME.pdf',
  ]

  for (const prefix of ignoredPrefixes) {
    if (path.startsWith(prefix)) return true
  }

  // Filter out common automated bots and scrapers
  const botPattern = /bot|spider|crawl|slurp|facebookexternalhit|lighthouse|mediapartners|pingdom|uptime|vercel-screenshot/i
  if (botPattern.test(userAgent)) {
    return true
  }

  return false
}

/**
 * Track a page view using Upstash Redis for high-speed deduplication and persist to Neon PostgreSQL
 */
export async function trackPageView(params: TrackViewParams): Promise<TrackViewResult> {
  const { path, visitorId = '', ip = '', userAgent = '', referrer = '', country = '', city = '' } = params

  if (shouldIgnoreTracking(path, userAgent || '')) {
    return {
      success: true,
      isUnique: false,
      totalViews: 0,
      uniqueVisitors: 0,
      pathViews: 0,
    }
  }

  const cleanPath = path.split('?')[0].toLowerCase() || '/'
  const visitorHash = generateVisitorHash(ip || 'anonymous', userAgent || 'unknown', visitorId)
  const todayStr = new Date().toISOString().split('T')[0] // 'YYYY-MM-DD'
  const monthStr = todayStr.substring(0, 7) // 'YYYY-MM'

  let isUnique = false
  let totalViews = 0
  let uniqueVisitors = 0
  let pathViews = 0

  // 1. Process with Redis if available
  if (redis) {
    try {
      // Check 24-hour deduplication key for this visitor
      const activeVisitorKey = `portfolio:visitor:active:${visitorHash}`
      const activeRes = await redis.set(activeVisitorKey, '1', {
        nx: true,
        ex: 86400, // 24 hours
      })

      isUnique = activeRes === 'OK'

      // Increment atomic counters in parallel using Redis pipeline
      const pipeline = redis.pipeline()

      // Site-wide total views
      pipeline.incr('portfolio:views:total')

      // Site-wide unique visitors (HyperLogLog)
      pipeline.pfadd('portfolio:unique_visitors', visitorHash)
      pipeline.pfcount('portfolio:unique_visitors')

      // Daily stats
      pipeline.incr(`portfolio:views:daily:${todayStr}`)
      if (isUnique) {
        pipeline.pfadd(`portfolio:views:daily_unique:${todayStr}`, visitorHash)
      }

      // Monthly stats
      pipeline.incr(`portfolio:views:monthly:${monthStr}`)

      // Path-specific views
      pipeline.incr(`portfolio:page:views:${cleanPath}`)
      pipeline.zincrby('portfolio:popular_pages', 1, cleanPath)

      const results = await pipeline.exec()

      totalViews = typeof results[0] === 'number' ? results[0] : 1
      uniqueVisitors = typeof results[2] === 'number' ? results[2] : 1
      pathViews = typeof results[6] === 'number' ? results[6] : 1
    } catch (redisError) {
      console.error('[Analytics] Redis tracking error:', redisError)
    }
  }

  // 2. Persist to PostgreSQL Database asynchronously (non-blocking)
  try {
    // Insert view log record
    await prisma.pageViewLog.create({
      data: {
        path: cleanPath,
        visitorHash,
        ip: ip ? ip.substring(0, 45) : null,
        userAgent: userAgent ? userAgent.substring(0, 255) : null,
        referrer: referrer ? referrer.substring(0, 255) : null,
        country: country ? country.substring(0, 100) : null,
        city: city ? city.substring(0, 100) : null,
        isUnique,
      },
    })

    // Upsert aggregated SiteMetric
    await prisma.siteMetric.upsert({
      where: { key: 'portfolio_stats' },
      create: {
        key: 'portfolio_stats',
        totalViews: totalViews || 1,
        uniqueVisitors: isUnique ? 1 : 0,
        metadata: {
          lastTrackedPath: cleanPath,
          lastTrackedAt: new Date().toISOString(),
        },
      },
      update: {
        totalViews: { increment: 1 },
        ...(isUnique ? { uniqueVisitors: { increment: 1 } } : {}),
        metadata: {
          lastTrackedPath: cleanPath,
          lastTrackedAt: new Date().toISOString(),
        },
      },
    })
  } catch (dbError) {
    console.error('[Analytics] Database persistence error:', dbError)
  }

  return {
    success: true,
    isUnique,
    totalViews,
    uniqueVisitors,
    pathViews,
  }
}

/**
 * Retrieve comprehensive live analytics for Admin Dashboard & Public Badges
 */
export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const todayStr = new Date().toISOString().split('T')[0]
  const monthStr = todayStr.substring(0, 7)

  let totalViews = 0
  let uniqueVisitors = 0
  let todayViews = 0
  let todayUnique = 0
  let monthViews = 0
  let popularPages: PopularPageItem[] = []
  let redisConnected = false
  let dbConnected = false
  let lastSyncedAt: Date | string = new Date().toISOString()

  // 1. Fetch from Redis if available
  if (redis) {
    try {
      const [
        totalViewsRes,
        uniqueVisitorsRes,
        todayViewsRes,
        todayUniqueRes,
        monthViewsRes,
        popularPagesRes,
      ] = await Promise.all([
        redis.get<number>('portfolio:views:total'),
        redis.pfcount('portfolio:unique_visitors'),
        redis.get<number>(`portfolio:views:daily:${todayStr}`),
        redis.pfcount(`portfolio:views:daily_unique:${todayStr}`),
        redis.get<number>(`portfolio:views:monthly:${monthStr}`),
        redis.zrange<string[]>('portfolio:popular_pages', 0, 9, {
          rev: true,
          withScores: true,
        }),
      ])

      totalViews = Number(totalViewsRes || 0)
      uniqueVisitors = Number(uniqueVisitorsRes || 0)
      todayViews = Number(todayViewsRes || 0)
      todayUnique = Number(todayUniqueRes || 0)
      monthViews = Number(monthViewsRes || 0)
      redisConnected = true

      if (Array.isArray(popularPagesRes)) {
        for (let i = 0; i < popularPagesRes.length; i += 2) {
          const path = popularPagesRes[i]
          const views = Number(popularPagesRes[i + 1] || 0)
          if (path) {
            popularPages.push({ path, views })
          }
        }
      }
    } catch (redisError) {
      console.error('[Analytics] Redis summary fetch error:', redisError)
      redisConnected = false
    }
  }

  // 2. Fetch database counts & recent logs from PostgreSQL
  let recentVisits: AnalyticsSummary['recentVisits'] = []
  try {
    const [dbMetric, dbTotalCount, dbUniqueCount, recentLogs] = await Promise.all([
      prisma.siteMetric.findUnique({ where: { key: 'portfolio_stats' } }),
      prisma.pageViewLog.count(),
      prisma.pageViewLog.count({ where: { isUnique: true } }),
      prisma.pageViewLog.findMany({
        take: 15,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          path: true,
          visitorHash: true,
          referrer: true,
          userAgent: true,
          isUnique: true,
          createdAt: true,
        },
      }),
    ])

    dbConnected = true
    recentVisits = recentLogs

    // If Redis didn't have total counts yet or was offline, fallback to DB
    if (totalViews === 0 && (dbMetric?.totalViews || dbTotalCount > 0)) {
      totalViews = Math.max(dbMetric?.totalViews || 0, dbTotalCount)
    }
    if (uniqueVisitors === 0 && (dbMetric?.uniqueVisitors || dbUniqueCount > 0)) {
      uniqueVisitors = Math.max(dbMetric?.uniqueVisitors || 0, dbUniqueCount)
    }

    if (dbMetric?.updatedAt) {
      lastSyncedAt = dbMetric.updatedAt
    }

    // If popular pages from Redis was empty, aggregate top paths from DB
    if (popularPages.length === 0) {
      const topPaths = await prisma.pageViewLog.groupBy({
        by: ['path'],
        _count: { path: true },
        orderBy: { _count: { path: 'desc' } },
        take: 5,
      })

      popularPages = topPaths.map((item: any) => ({
        path: item.path,
        views: item._count?.path ?? 0,
      }))
    }
  } catch (dbError) {
    console.error('[Analytics] Database summary fetch error:', dbError)
    dbConnected = false
  }

  return {
    totalViews,
    uniqueVisitors,
    todayViews,
    todayUnique,
    monthViews,
    popularPages,
    recentVisits,
    redisConnected,
    dbConnected,
    lastSyncedAt,
  }
}
