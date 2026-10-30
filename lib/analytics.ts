import { redis } from '@/lib/redis'
import { prisma } from '@/lib/prisma'
import { unstable_cache, revalidateTag } from 'next/cache'
import crypto from 'crypto'
import {
  VisitorLocation,
  getApproximateLocation,
  getCountryFlag,
  formatLocationLabel,
} from '@/lib/geo'

export const VIEW_COUNT_CACHE_TAG = 'portfolio-views'

// In-memory fallback tracking for serverless / dev resilience when DB or Redis is offline
const globalAnalyticsMemory = globalThis as unknown as {
  memoryVisitorSet?: Set<string>
  memoryTotalViews?: number
  memoryUniqueVisitors?: number
}
if (!globalAnalyticsMemory.memoryVisitorSet) {
  globalAnalyticsMemory.memoryVisitorSet = new Set<string>()
}
if (globalAnalyticsMemory.memoryTotalViews === undefined) {
  globalAnalyticsMemory.memoryTotalViews = 0
}
if (globalAnalyticsMemory.memoryUniqueVisitors === undefined) {
  globalAnalyticsMemory.memoryUniqueVisitors = 0
}

export interface TrackViewParams {
  path: string
  visitorId?: string
  ip?: string | null
  userAgent?: string | null
  referrer?: string | null
  country?: string | null
  city?: string | null
  headers?: Headers | Record<string, string | string[] | undefined>
}

export interface TrackViewResult {
  success: boolean
  isUnique: boolean
  totalViews: number
  uniqueVisitors: number
  pathViews: number
  location?: VisitorLocation | null
}

export interface PopularPageItem {
  path: string
  title?: string
  views: number
}

export interface VisitorLocationItem {
  id: string
  timestamp: string
  path: string
  country?: string
  countryCode?: string
  region?: string
  city?: string
  timezone?: string
  formattedLocation: string
  flag: string
}

export interface TopLocationItem {
  name: string
  views: number
  code?: string
  flag?: string
}

export interface AnalyticsSummary {
  totalViews: number
  uniqueVisitors: number
  todayViews: number
  todayUnique: number
  monthViews: number
  popularPages: PopularPageItem[]
  recentVisitors: VisitorLocationItem[]
  topCountries: TopLocationItem[]
  topCities: TopLocationItem[]
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
 * Privacy-compliant SHA-256 IP/visitor hashing with a server-side secret.
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
 * Filter out common web crawlers, administrative paths, and static assets
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

  // Filter out automated bots, scrapers, and uptime checkers
  const botPattern = /bot|spider|crawl|slurp|facebookexternalhit|lighthouse|mediapartners|pingdom|uptime|vercel-screenshot/i
  if (botPattern.test(userAgent)) {
    return true
  }

  return false
}

/**
 * Helper to safely trigger tag revalidation
 */
export function triggerViewCountRevalidation() {
  try {
    revalidateTag(VIEW_COUNT_CACHE_TAG, 'max')
  } catch (tagErr) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[Analytics] Failed to revalidate tag portfolio-views:', tagErr)
    }
  }
}

/**
 * Next.js server-side cached read for canonical view count.
 * Uses tag-based invalidation ('portfolio-views') with a 60-second fallback revalidation.
 */
export const getViewCount = unstable_cache(
  async (): Promise<number> => {
    if (!redis) return globalAnalyticsMemory.memoryTotalViews || 0
    try {
      const raw = await redis.get<number | string>('portfolio:views')
      if (raw !== null && raw !== undefined) {
        return Number(raw)
      }
      const legacyRaw = await redis.get<number | string>('portfolio:views:total')
      if (legacyRaw !== null && legacyRaw !== undefined) {
        const legacyVal = Number(legacyRaw)
        await redis.set('portfolio:views', legacyVal).catch(() => {})
        return legacyVal
      }
      return 0
    } catch (err) {
      console.error('[Analytics] Failed to fetch cached view count from Redis:', err)
      return 0
    }
  },
  ['portfolio-views-count'],
  {
    tags: [VIEW_COUNT_CACHE_TAG],
    revalidate: 60,
  }
)

/**
 * Next.js server-side cached read for canonical unique visitor count.
 */
export const getUniqueVisitorCount = unstable_cache(
  async (): Promise<number> => {
    if (redis) {
      try {
        const [setCount, hllCount, countRes] = await Promise.all([
          redis.scard('portfolio:unique_visitors_set'),
          redis.pfcount('portfolio:unique_visitors'),
          redis.get<number | string>('portfolio:unique_visitors_count'),
        ])
        const count = Math.max(Number(setCount || 0), Number(hllCount || 0), Number(countRes || 0))
        if (count > 0) return count
      } catch (err) {
        console.error('[Analytics] Failed to fetch unique visitor count from Redis:', err)
      }
    }

    try {
      const distinct = await prisma.pageViewLog.groupBy({
        by: ['visitorHash'],
        _count: { visitorHash: true },
      })
      if (distinct.length > 0) return distinct.length
    } catch {
      // Fallback to in-memory
    }

    return globalAnalyticsMemory.memoryUniqueVisitors || 0
  },
  ['portfolio-unique-visitor-count'],
  {
    tags: [VIEW_COUNT_CACHE_TAG],
    revalidate: 60,
  }
)

/**
 * Track a portfolio page view.
 * Guarantees that each visitor is counted as a unique visitor ONLY ONCE:
 * If the user visits again (reloads, returns later, or navigates pages),
 * the unique visitor counter does NOT increase.
 */
export async function trackPageView(params: TrackViewParams): Promise<TrackViewResult> {
  const { path, visitorId, ip = '', userAgent = '', referrer = '', country = '', city = '', headers } = params

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
  const effectiveIp = (ip || '127.0.0.1').trim()

  // Prioritize explicit persistent visitorId (stored in client cookie / localStorage);
  // fallback to IP + normalized User-Agent
  const rawVisitorIdentity =
    visitorId && visitorId.trim().length > 0
      ? `vid:${visitorId.trim()}`
      : `ip:${effectiveIp}:${(userAgent || '').substring(0, 100).toLowerCase()}`

  const ipHash = hashClientIp(rawVisitorIdentity)
  const visitorHash = ipHash.substring(0, 32)
  const todayStr = new Date().toISOString().split('T')[0] // 'YYYY-MM-DD'
  const monthStr = todayStr.substring(0, 7) // 'YYYY-MM'

  let isUnique = false
  let totalViews = 0
  let uniqueVisitors = 0
  let pathViews = 0
  let resolvedLocation: VisitorLocation | null = null

  // 1. In-memory check (immediate process-level uniqueness check)
  const seenInMemory = globalAnalyticsMemory.memoryVisitorSet?.has(visitorHash) || false

  // 2. Redis uniqueness check
  let isNewInRedis = false
  let checkedRedis = false
  if (redis) {
    try {
      const saddRes = await redis.sadd('portfolio:unique_visitors_set', visitorHash)
      isNewInRedis = saddRes === 1
      checkedRedis = true
      await redis.pfadd('portfolio:unique_visitors', visitorHash)
    } catch (redisErr) {
      console.error('[Analytics] Redis uniqueness check error:', redisErr)
    }
  }

  // 3. PostgreSQL uniqueness check
  let hasVisitedInDb = false
  let checkedDb = false
  try {
    const existingLog = await prisma.pageViewLog.findFirst({
      where: { visitorHash },
      select: { id: true },
    })
    hasVisitedInDb = Boolean(existingLog)
    checkedDb = true
  } catch {
    // DB unreachable or table not ready
  }

  // Determine true uniqueness:
  // If seen previously anywhere (Redis, DB, or in-memory), visitor is NOT unique!
  if (seenInMemory) {
    isUnique = false
  } else if (checkedRedis) {
    isUnique = isNewInRedis && !hasVisitedInDb
  } else if (checkedDb) {
    isUnique = !hasVisitedInDb
  } else {
    // If external storages are offline, in-memory state is authoritative
    isUnique = !seenInMemory
  }

  // Update in-memory set immediately to lock this visitor
  globalAnalyticsMemory.memoryVisitorSet?.add(visitorHash)

  if (isUnique) {
    // ── First-time unique visitor ─────────────────────────────────────
    globalAnalyticsMemory.memoryUniqueVisitors = (globalAnalyticsMemory.memoryUniqueVisitors || 0) + 1
    globalAnalyticsMemory.memoryTotalViews = (globalAnalyticsMemory.memoryTotalViews || 0) + 1

    try {
      resolvedLocation = await getApproximateLocation(effectiveIp, headers)
      if (!resolvedLocation && (country || city)) {
        resolvedLocation = {
          country: country || undefined,
          city: city || undefined,
        }
      }
    } catch {
      resolvedLocation = null
    }

    const locCountry = resolvedLocation?.country || 'Unknown'
    const locCountryCode = resolvedLocation?.countryCode || ''
    const locCity = resolvedLocation?.city || 'Unknown'
    const locRegion = resolvedLocation?.region || ''
    const locTimezone = resolvedLocation?.timezone || ''

    const visitorRecord = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      path: cleanPath,
      country: locCountry !== 'Unknown' ? locCountry : undefined,
      countryCode: locCountryCode || undefined,
      region: locRegion || undefined,
      city: locCity !== 'Unknown' ? locCity : undefined,
      timezone: locTimezone || undefined,
    }

    if (redis) {
      try {
        const pipeline = redis.pipeline()
        pipeline.incr('portfolio:views')
        pipeline.incr('portfolio:unique_visitors_count')
        pipeline.scard('portfolio:unique_visitors_set')
        pipeline.pfcount('portfolio:unique_visitors')

        // Daily / Monthly stats
        pipeline.incr(`portfolio:views:daily:${todayStr}`)
        pipeline.pfadd(`portfolio:views:daily_unique:${todayStr}`, visitorHash)
        pipeline.incr(`portfolio:views:monthly:${monthStr}`)

        // Path-specific views
        pipeline.incr(`portfolio:page:views:${cleanPath}`)
        pipeline.zincrby('portfolio:popular_pages', 1, cleanPath)

        // Geolocation aggregation
        if (locCountry && locCountry !== 'Unknown') {
          pipeline.zincrby('portfolio:locations:countries', 1, locCountry)
        }
        if (locCity && locCity !== 'Unknown' && locCountry && locCountry !== 'Unknown') {
          pipeline.zincrby('portfolio:locations:cities', 1, `${locCity}, ${locCountry}`)
        }

        // Recent visitors list (keep latest 30)
        pipeline.lpush('portfolio:recent_visitors', JSON.stringify(visitorRecord))
        pipeline.ltrim('portfolio:recent_visitors', 0, 29)

        const results = await pipeline.exec()
        totalViews = typeof results[0] === 'number' ? results[0] : Number(results[0] || 1)
        const setCount = typeof results[2] === 'number' ? results[2] : Number(results[2] || 0)
        const hllCount = typeof results[3] === 'number' ? results[3] : Number(results[3] || 0)
        const counterVal = typeof results[1] === 'number' ? results[1] : Number(results[1] || 0)
        uniqueVisitors = Math.max(setCount, hllCount, counterVal, 1)
        pathViews = typeof results[6] === 'number' ? results[6] : 1

        triggerViewCountRevalidation()
      } catch (redisError) {
        console.error('[Analytics] Redis pipeline execution error:', redisError)
      }
    }

    // Persist unique visit to PostgreSQL
    try {
      await prisma.pageViewLog.create({
        data: {
          path: cleanPath,
          visitorHash,
          ip: null, // Privacy
          userAgent: userAgent ? userAgent.substring(0, 255) : null,
          referrer: referrer ? referrer.substring(0, 255) : null,
          country: resolvedLocation?.country || (country ? country.substring(0, 100) : null),
          city: resolvedLocation?.city || (city ? city.substring(0, 100) : null),
          isUnique: true,
        },
      })

      await prisma.siteMetric.upsert({
        where: { key: 'portfolio_stats' },
        create: {
          key: 'portfolio_stats',
          totalViews: 1,
          uniqueVisitors: 1,
        },
        update: {
          totalViews: { increment: 1 },
          uniqueVisitors: { increment: 1 },
        },
      })

      if (!redis) {
        const distinct = await prisma.pageViewLog.groupBy({
          by: ['visitorHash'],
          _count: { visitorHash: true },
        })
        uniqueVisitors = distinct.length
        totalViews = await prisma.pageViewLog.count()
      }
    } catch {
      // If DB is offline, fallback to in-memory count
      if (!redis) {
        uniqueVisitors = globalAnalyticsMemory.memoryUniqueVisitors || 1
        totalViews = globalAnalyticsMemory.memoryTotalViews || 1
      }
    }
  } else {
    // ── Returning visitor: DO NOT INCREMENT uniqueVisitors! ───────────
    if (redis) {
      try {
        const [curTotal, curSetCount, curHllCount, curCount, curPath] = await Promise.all([
          redis.get<number | string>('portfolio:views'),
          redis.scard('portfolio:unique_visitors_set'),
          redis.pfcount('portfolio:unique_visitors'),
          redis.get<number | string>('portfolio:unique_visitors_count'),
          redis.get<number | string>(`portfolio:page:views:${cleanPath}`),
        ])

        totalViews = Number(curTotal || 0)
        uniqueVisitors = Math.max(Number(curSetCount || 0), Number(curHllCount || 0), Number(curCount || 0))
        pathViews = Number(curPath || 0)

        // Throttle page view increments per path to 10 minutes to prevent reload abuse
        const throttleKey = `portfolio:throttle:${visitorHash}:${cleanPath}`
        const canIncrement = await redis.set(throttleKey, '1', {
          nx: true,
          ex: 600, // 10 minutes
        })

        if (canIncrement === 'OK') {
          const pipe = redis.pipeline()
          pipe.incr('portfolio:views')
          pipe.incr(`portfolio:page:views:${cleanPath}`)
          pipe.zincrby('portfolio:popular_pages', 1, cleanPath)
          const pResults = await pipe.exec()
          totalViews = typeof pResults[0] === 'number' ? pResults[0] : totalViews + 1
        }
      } catch (redisError) {
        console.error('[Analytics] Redis read error for returning visitor:', redisError)
      }
    }

    // In DB: Log returning visit with isUnique: false (throttled to 10 mins per path)
    try {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)
      const recentLog = await prisma.pageViewLog.findFirst({
        where: {
          visitorHash,
          path: cleanPath,
          createdAt: { gte: tenMinutesAgo },
        },
        select: { id: true },
      })

      if (!recentLog) {
        await prisma.pageViewLog.create({
          data: {
            path: cleanPath,
            visitorHash,
            ip: null,
            userAgent: userAgent ? userAgent.substring(0, 255) : null,
            referrer: referrer ? referrer.substring(0, 255) : null,
            isUnique: false, // Returning visitor: NEVER true
          },
        })

        await prisma.siteMetric.upsert({
          where: { key: 'portfolio_stats' },
          create: {
            key: 'portfolio_stats',
            totalViews: 1,
            uniqueVisitors: 1,
          },
          update: {
            totalViews: { increment: 1 },
            // DO NOT increment uniqueVisitors!
          },
        })
      }

      if (!redis) {
        const distinct = await prisma.pageViewLog.groupBy({
          by: ['visitorHash'],
          _count: { visitorHash: true },
        })
        uniqueVisitors = distinct.length
        totalViews = await prisma.pageViewLog.count()
      }
    } catch {
      if (!redis) {
        uniqueVisitors = globalAnalyticsMemory.memoryUniqueVisitors || 1
        totalViews = globalAnalyticsMemory.memoryTotalViews || 1
      }
    }
  }

  return {
    success: true,
    isUnique,
    totalViews,
    uniqueVisitors,
    pathViews,
    location: resolvedLocation,
  }
}

/**
 * Internal un-cached fetch of complete analytics summary
 */
async function _fetchAnalyticsSummary(): Promise<AnalyticsSummary> {
  const todayStr = new Date().toISOString().split('T')[0]
  const monthStr = todayStr.substring(0, 7)

  let totalViews = globalAnalyticsMemory.memoryTotalViews || 0
  let uniqueVisitors = globalAnalyticsMemory.memoryUniqueVisitors || 0
  let todayViews = 0
  let todayUnique = 0
  let monthViews = 0
  let popularPages: PopularPageItem[] = []
  let recentVisitors: VisitorLocationItem[] = []
  let topCountries: TopLocationItem[] = []
  let topCities: TopLocationItem[] = []
  let redisConnected = false
  let dbConnected = false
  let lastSyncedAt: Date | string = new Date().toISOString()

  // 1. Fetch from Redis
  if (redis) {
    try {
      const [
        totalViewsRes,
        legacyViewsRes,
        uniqueVisitorsHll,
        uniqueVisitorsSet,
        uniqueVisitorsCount,
        todayViewsRes,
        todayUniqueRes,
        monthViewsRes,
        popularPagesRes,
        recentVisitorsRes,
        topCountriesRes,
        topCitiesRes,
      ] = await Promise.all([
        redis.get<number | string>('portfolio:views'),
        redis.get<number | string>('portfolio:views:total'),
        redis.pfcount('portfolio:unique_visitors'),
        redis.scard('portfolio:unique_visitors_set'),
        redis.get<number | string>('portfolio:unique_visitors_count'),
        redis.get<number | string>(`portfolio:views:daily:${todayStr}`),
        redis.pfcount(`portfolio:views:daily_unique:${todayStr}`),
        redis.get<number | string>(`portfolio:views:monthly:${monthStr}`),
        redis.zrange<string[]>('portfolio:popular_pages', 0, 9, {
          rev: true,
          withScores: true,
        }),
        redis.lrange<string | object>('portfolio:recent_visitors', 0, 19),
        redis.zrange<string[]>('portfolio:locations:countries', 0, 9, {
          rev: true,
          withScores: true,
        }),
        redis.zrange<string[]>('portfolio:locations:cities', 0, 9, {
          rev: true,
          withScores: true,
        }),
      ])

      totalViews = Number(totalViewsRes ?? legacyViewsRes ?? 0)
      uniqueVisitors = Math.max(
        Number(uniqueVisitorsSet || 0),
        Number(uniqueVisitorsHll || 0),
        Number(uniqueVisitorsCount || 0)
      )
      todayViews = Number(todayViewsRes || 0)
      todayUnique = Number(todayUniqueRes || 0)
      monthViews = Number(monthViewsRes || 0)
      redisConnected = true

      // Parse popular pages
      if (Array.isArray(popularPagesRes)) {
        for (let i = 0; i < popularPagesRes.length; i += 2) {
          const pPath = popularPagesRes[i]
          const pViews = Number(popularPagesRes[i + 1] || 0)
          if (pPath) {
            popularPages.push({ path: pPath, views: pViews })
          }
        }
      }

      // Parse recent visitors
      if (Array.isArray(recentVisitorsRes)) {
        for (const item of recentVisitorsRes) {
          try {
            const parsed = typeof item === 'string' ? JSON.parse(item) : item
            if (parsed && typeof parsed === 'object') {
              recentVisitors.push({
                id: parsed.id || crypto.randomUUID(),
                timestamp: parsed.timestamp || new Date().toISOString(),
                path: parsed.path || '/',
                country: parsed.country,
                countryCode: parsed.countryCode,
                region: parsed.region,
                city: parsed.city,
                timezone: parsed.timezone,
                formattedLocation: formatLocationLabel(parsed),
                flag: getCountryFlag(parsed.countryCode),
              })
            }
          } catch {}
        }
      }

      // Parse top countries
      if (Array.isArray(topCountriesRes)) {
        for (let i = 0; i < topCountriesRes.length; i += 2) {
          const countryName = topCountriesRes[i]
          const views = Number(topCountriesRes[i + 1] || 0)
          if (countryName) {
            topCountries.push({
              name: countryName,
              views,
              flag: countryName === 'Localhost' ? '💻' : getCountryFlag(countryName.substring(0, 2)),
            })
          }
        }
      }

      // Parse top cities
      if (Array.isArray(topCitiesRes)) {
        for (let i = 0; i < topCitiesRes.length; i += 2) {
          const cityName = topCitiesRes[i]
          const views = Number(topCitiesRes[i + 1] || 0)
          if (cityName) {
            topCities.push({
              name: cityName,
              views,
            })
          }
        }
      }
    } catch (redisError) {
      console.error('[Analytics] Redis summary fetch error:', redisError)
      redisConnected = false
    }
  }

  // 2. Fetch database recent logs from PostgreSQL
  let recentVisits: AnalyticsSummary['recentVisits'] = []
  try {
    const [dbTotalCount, dbDistinctVisitors, recentLogs] = await Promise.all([
      prisma.pageViewLog.count(),
      prisma.pageViewLog.groupBy({
        by: ['visitorHash'],
        _count: { visitorHash: true },
      }),
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
    const dbUniqueCount = dbDistinctVisitors.length

    // Fallback counts if Redis was not populated yet
    if (totalViews === 0 && dbTotalCount > 0) {
      totalViews = dbTotalCount
    }
    if (uniqueVisitors === 0 && dbUniqueCount > 0) {
      uniqueVisitors = dbUniqueCount
    }

    // Fallback top paths if Redis popular pages was empty
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
    recentVisitors,
    topCountries,
    topCities,
    recentVisits,
    redisConnected,
    dbConnected,
    lastSyncedAt,
  }
}

/**
 * Retrieve comprehensive live analytics for Admin Dashboard.
 * Wrapped in Next.js `unstable_cache` with tag `portfolio-views`.
 */
export const getAnalyticsSummary = unstable_cache(
  _fetchAnalyticsSummary,
  ['portfolio-analytics-summary'],
  {
    tags: [VIEW_COUNT_CACHE_TAG],
    revalidate: 60,
  }
)

/**
 * Direct un-cached fetch function when instant live bypass is requested
 */
export async function getLiveAnalyticsSummary(): Promise<AnalyticsSummary> {
  return _fetchAnalyticsSummary()
}
