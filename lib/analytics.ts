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
 * Privacy-compliant SHA-256 IP hashing with a server-side secret.
 * 
 * Why the IP is hashed:
 * - Raw IP addresses are considered Personal Identifiable Information (PII) under privacy regulations (GDPR/CCPA).
 * - Salting with process.env.VIEW_HASH_SECRET ensures the hash is one-way and immune to dictionary/rainbow-table reverse lookups.
 * - Raw IP addresses are NEVER stored in Redis, written to database logs, or exposed to the client.
 */
export function hashClientIp(ip: string = ''): string {
  const secret = process.env.VIEW_HASH_SECRET || 'portfolio_default_ip_salt_fallback_2026'
  const normalizedIp = (ip || '127.0.0.1').trim().toLowerCase()
  return crypto
    .createHash('sha256')
    .update(`${normalizedIp}:${secret}`)
    .digest('hex')
}

/**
 * Generate a consistent SHA-256 hash for a visitor to preserve privacy
 */
export function generateVisitorHash(ip: string = '', userAgent: string = '', visitorId: string = ''): string {
  return hashClientIp(ip).substring(0, 32)
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
 * Track a portfolio page view using Upstash Redis for 24-hour IP-based deduplication
 * Atomic SET NX EX ensures a visitor (IP) is only counted once every 24 hours.
 */
export async function trackPageView(params: TrackViewParams): Promise<TrackViewResult> {
  const { path, ip = '', userAgent = '', referrer = '', country = '', city = '' } = params

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
  const ipHash = hashClientIp(ip || '127.0.0.1')
  const visitorHash = ipHash.substring(0, 32)
  const todayStr = new Date().toISOString().split('T')[0] // 'YYYY-MM-DD'
  const monthStr = todayStr.substring(0, 7) // 'YYYY-MM'

  let isUnique = false
  let totalViews = 0
  let uniqueVisitors = 0
  let pathViews = 0

  // 1. Process with Redis atomic 24-hour deduplication if available
  if (redis) {
    try {
      // 24-hour IP deduplication key
      const dedupKey = `portfolio:view:dedup:${ipHash}`
      
      // Atomic SET ... NX EX 86400 (24 hours)
      const setRes = await redis.set(dedupKey, '1', {
        nx: true,
        ex: 86400, // 24 hours TTL
      })

      isUnique = setRes === 'OK'

      if (isUnique) {
        // NEW unique visitor view in the current 24-hour window -> Atomically increment counters
        const pipeline = redis.pipeline()

        // Site-wide total views
        pipeline.incr('portfolio:views:total')

        // Site-wide unique visitors (HyperLogLog)
        pipeline.pfadd('portfolio:unique_visitors', ipHash)
        pipeline.pfcount('portfolio:unique_visitors')

        // Daily stats
        pipeline.incr(`portfolio:views:daily:${todayStr}`)
        pipeline.pfadd(`portfolio:views:daily_unique:${todayStr}`, ipHash)

        // Monthly stats
        pipeline.incr(`portfolio:views:monthly:${monthStr}`)

        // Path-specific views
        pipeline.incr(`portfolio:page:views:${cleanPath}`)
        pipeline.zincrby('portfolio:popular_pages', 1, cleanPath)

        const results = await pipeline.exec()

        totalViews = typeof results[0] === 'number' ? results[0] : 1
        uniqueVisitors = typeof results[2] === 'number' ? results[2] : 1
        pathViews = typeof results[5] === 'number' ? results[5] : 1
      } else {
        // REFRESH / Returning visitor within 24h -> Read current counts WITHOUT incrementing
        const [curTotal, curUnique, curPath] = await Promise.all([
          redis.get<number>('portfolio:views:total'),
          redis.pfcount('portfolio:unique_visitors'),
          redis.get<number>(`portfolio:page:views:${cleanPath}`),
        ])

        totalViews = Number(curTotal || 0)
        uniqueVisitors = Number(curUnique || 0)
        pathViews = Number(curPath || 0)
      }
    } catch (redisError) {
      console.error('[Analytics] Redis tracking error:', redisError)
    }
  }

  // 2. Persist ONLY unique views to PostgreSQL Database (non-blocking)
  if (isUnique) {
    try {
      // Insert view log record (NEVER storing raw IP address for privacy)
      await prisma.pageViewLog.create({
        data: {
          path: cleanPath,
          visitorHash,
          ip: null, // Privacy compliant: raw IP is NEVER stored
          userAgent: userAgent ? userAgent.substring(0, 255) : null,
          referrer: referrer ? referrer.substring(0, 255) : null,
          country: country ? country.substring(0, 100) : null,
          city: city ? city.substring(0, 100) : null,
          isUnique: true,
        },
      })

      // Upsert aggregated SiteMetric
      await prisma.siteMetric.upsert({
        where: { key: 'portfolio_stats' },
        create: {
          key: 'portfolio_stats',
          totalViews: totalViews || 1,
          uniqueVisitors: 1,
          metadata: {
            lastTrackedPath: cleanPath,
            lastTrackedAt: new Date().toISOString(),
          },
        },
        update: {
          totalViews: { increment: 1 },
          uniqueVisitors: { increment: 1 },
          metadata: {
            lastTrackedPath: cleanPath,
            lastTrackedAt: new Date().toISOString(),
          },
        },
      })
    } catch (dbError) {
      console.error('[Analytics] Database persistence error:', dbError)
    }
  } else if (totalViews === 0) {
    // Fallback to database count if Redis wasn't connected
    try {
      const metric = await prisma.siteMetric.findUnique({ where: { key: 'portfolio_stats' } })
      if (metric) {
        totalViews = metric.totalViews
        uniqueVisitors = metric.uniqueVisitors
      }
    } catch {}
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
