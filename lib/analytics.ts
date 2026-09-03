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
 * Privacy-compliant SHA-256 IP hashing with a server-side secret.
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
    if (!redis) return 0
    try {
      const raw = await redis.get<number | string>('portfolio:views')
      if (raw !== null && raw !== undefined) {
        return Number(raw)
      }
      // Migration fallback: check if legacy key existed
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
 * Track a portfolio page view using Upstash Redis for atomic deduplication and counters.
 */
export async function trackPageView(params: TrackViewParams): Promise<TrackViewResult> {
  const { path, ip = '', userAgent = '', referrer = '', country = '', city = '', headers } = params

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
  const effectiveIp = ip || '127.0.0.1'
  const ipHash = hashClientIp(effectiveIp)
  const visitorHash = ipHash.substring(0, 32)
  const todayStr = new Date().toISOString().split('T')[0] // 'YYYY-MM-DD'
  const monthStr = todayStr.substring(0, 7) // 'YYYY-MM'

  let isUnique = false
  let totalViews = 0
  let uniqueVisitors = 0
  let pathViews = 0
  let resolvedLocation: VisitorLocation | null = null

  // 1. Process with Redis if available
  if (redis) {
    try {
      // 24-hour IP deduplication key
      const dedupKey = `portfolio:view:dedup:${ipHash}`

      // Atomic SET ... NX EX 86400 (24 hours)
      const setRes = await redis.set(dedupKey, '1', {
        nx: true,
        ex: 86400,
      })

      isUnique = setRes === 'OK'

      if (isUnique) {
        // Resolve approximate visitor location server-side
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

        // Prepare recent visitor object
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

        const pipeline = redis.pipeline()

        // 1. Canonical total views counter
        pipeline.incr('portfolio:views')

        // 2. Site-wide unique visitors (HyperLogLog)
        pipeline.pfadd('portfolio:unique_visitors', ipHash)
        pipeline.pfcount('portfolio:unique_visitors')

        // 3. Daily stats
        pipeline.incr(`portfolio:views:daily:${todayStr}`)
        pipeline.pfadd(`portfolio:views:daily_unique:${todayStr}`, ipHash)

        // 4. Monthly stats
        pipeline.incr(`portfolio:views:monthly:${monthStr}`)

        // 5. Path-specific views
        pipeline.incr(`portfolio:page:views:${cleanPath}`)
        pipeline.zincrby('portfolio:popular_pages', 1, cleanPath)

        // 6. Geolocation aggregation
        if (locCountry && locCountry !== 'Unknown') {
          pipeline.zincrby('portfolio:locations:countries', 1, locCountry)
        }
        if (locCity && locCity !== 'Unknown' && locCountry && locCountry !== 'Unknown') {
          pipeline.zincrby('portfolio:locations:cities', 1, `${locCity}, ${locCountry}`)
        }

        // 7. Recent visitors list (keep latest 30)
        pipeline.lpush('portfolio:recent_visitors', JSON.stringify(visitorRecord))
        pipeline.ltrim('portfolio:recent_visitors', 0, 29)

        const results = await pipeline.exec()

        totalViews = typeof results[0] === 'number' ? results[0] : Number(results[0] || 1)
        uniqueVisitors = typeof results[2] === 'number' ? results[2] : Number(results[2] || 1)
        pathViews = typeof results[5] === 'number' ? results[5] : Number(results[5] || 1)

        // 8. Invalidate Next.js cache tag
        triggerViewCountRevalidation()
      } else {
        // Returning visitor / duplicate refresh within 24h -> Read counts WITHOUT incrementing
        const [curTotal, curLegacy, curUnique, curPath] = await Promise.all([
          redis.get<number | string>('portfolio:views'),
          redis.get<number | string>('portfolio:views:total'),
          redis.pfcount('portfolio:unique_visitors'),
          redis.get<number | string>(`portfolio:page:views:${cleanPath}`),
        ])

        totalViews = Number(curTotal ?? curLegacy ?? 0)
        uniqueVisitors = Number(curUnique || 0)
        pathViews = Number(curPath || 0)
      }
    } catch (redisError) {
      console.error('[Analytics] Redis tracking error:', redisError)
    }
  }

  // 2. Audit logging to PostgreSQL (non-blocking, storing NO raw IP)
  if (isUnique) {
    try {
      await prisma.pageViewLog.create({
        data: {
          path: cleanPath,
          visitorHash,
          ip: null, // Privacy: raw IP is NEVER stored
          userAgent: userAgent ? userAgent.substring(0, 255) : null,
          referrer: referrer ? referrer.substring(0, 255) : null,
          country: resolvedLocation?.country || (country ? country.substring(0, 100) : null),
          city: resolvedLocation?.city || (city ? city.substring(0, 100) : null),
          isUnique: true,
        },
      })
    } catch (dbError) {
      console.error('[Analytics] Database persistence error:', dbError)
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

  let totalViews = 0
  let uniqueVisitors = 0
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
        uniqueVisitorsRes,
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
      uniqueVisitors = Number(uniqueVisitorsRes || 0)
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
    const [dbTotalCount, dbUniqueCount, recentLogs] = await Promise.all([
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
