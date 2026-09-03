import { redis } from '@/lib/redis'
import crypto from 'crypto'

export interface VisitorLocation {
  country?: string
  countryCode?: string
  region?: string
  city?: string
  latitude?: number
  longitude?: number
  timezone?: string
}

/**
 * Privacy-compliant SHA-256 IP hashing with a server-side secret.
 */
export function hashIp(ip: string = ''): string {
  const secret = process.env.VIEW_HASH_SECRET || 'portfolio_default_ip_salt_fallback_2026'
  const normalizedIp = (ip || '127.0.0.1').trim().toLowerCase()
  return crypto
    .createHash('sha256')
    .update(`${normalizedIp}:${secret}`)
    .digest('hex')
}

/**
 * Check if an IP address is a private, loopback, or local link address
 */
export function isLocalOrPrivateIp(ip: string): boolean {
  if (!ip) return true
  const cleanIp = ip.trim().toLowerCase()
  if (
    cleanIp === '127.0.0.1' ||
    cleanIp === '::1' ||
    cleanIp === 'localhost' ||
    cleanIp === 'unknown' ||
    cleanIp.startsWith('10.') ||
    cleanIp.startsWith('192.168.') ||
    cleanIp.startsWith('169.254.') ||
    cleanIp.startsWith('fc00:') ||
    cleanIp.startsWith('fe80:')
  ) {
    return true
  }

  // Check 172.16.0.0 - 172.31.255.255
  if (cleanIp.startsWith('172.')) {
    const parts = cleanIp.split('.')
    if (parts.length >= 2) {
      const secondOctet = parseInt(parts[1], 10)
      if (secondOctet >= 16 && secondOctet <= 31) {
        return true
      }
    }
  }

  return false
}

/**
 * Safely extract the client IP address across reverse proxies and CDNs (Vercel, Cloudflare, AWS, Nginx)
 */
export function extractClientIp(headers: Headers | Record<string, string | string[] | undefined>): string {
  const getHeader = (name: string): string | null => {
    if (typeof (headers as Headers).get === 'function') {
      return (headers as Headers).get(name)
    }
    const val = (headers as Record<string, string | string[] | undefined>)[name.toLowerCase()]
    if (Array.isArray(val)) return val[0] || null
    return val || null
  }

  const forwardedFor = getHeader('x-forwarded-for')
  if (forwardedFor) {
    // x-forwarded-for may be a comma-separated list; first entry is the original client IP
    const parts = forwardedFor.split(',')
    for (const part of parts) {
      const trimmed = part.trim()
      if (trimmed && !isLocalOrPrivateIp(trimmed)) {
        return trimmed
      }
    }
    // If all were private/proxies, return the first one
    if (parts[0]?.trim()) {
      return parts[0].trim()
    }
  }

  const realIp =
    getHeader('x-real-ip') ||
    getHeader('cf-connecting-ip') ||
    getHeader('true-client-ip') ||
    getHeader('x-client-ip')

  return realIp ? realIp.trim() : '127.0.0.1'
}

/**
 * Convert 2-letter ISO country code (e.g. "IN", "US", "GB") into a country flag emoji (🇮🇳, 🇺🇸, 🇬🇧)
 */
export function getCountryFlag(countryCode?: string | null): string {
  if (!countryCode || countryCode.length !== 2 || countryCode.toUpperCase() === 'LOCAL') {
    return '🌐'
  }
  const code = countryCode.toUpperCase()
  const offset = 127397
  try {
    return String.fromCodePoint(...[...code].map((c) => c.charCodeAt(0) + offset))
  } catch {
    return '🌐'
  }
}

/**
 * Format a human-readable approximate location label (e.g. "Chennai, Tamil Nadu, India")
 */
export function formatLocationLabel(loc?: Partial<VisitorLocation> | null): string {
  if (!loc) return 'Location unavailable'
  const parts = [loc.city, loc.region, loc.country].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : 'Location unavailable'
}

/**
 * Server-side IP Geolocation Lookup
 * 
 * Flow:
 * 1. Checks CDN headers (Vercel / Cloudflare) for 0ms lookup.
 * 2. Checks Redis cache `portfolio:geo:${ipHash}` (7-day TTL).
 * 3. Falls back to external IP geolocation provider with a strict 1200ms timeout.
 * 4. Fails open gracefully (returns null without blocking or erroring page tracking).
 */
export async function getApproximateLocation(
  ip: string,
  headers?: Headers | Record<string, string | string[] | undefined>
): Promise<VisitorLocation | null> {
  // 1. Try extracting geolocation from CDN headers (e.g. Vercel / Cloudflare)
  if (headers) {
    const getHeader = (name: string): string | null => {
      if (typeof (headers as Headers).get === 'function') {
        return (headers as Headers).get(name)
      }
      const val = (headers as Record<string, string | string[] | undefined>)[name.toLowerCase()]
      if (Array.isArray(val)) return val[0] || null
      return val || null
    }

    const cdnCountry = getHeader('x-vercel-ip-country')
    const cdnRegion = getHeader('x-vercel-ip-country-region')
    const cdnCity = getHeader('x-vercel-ip-city')
    const cdnLat = getHeader('x-vercel-ip-latitude')
    const cdnLon = getHeader('x-vercel-ip-longitude')
    const cdnTimezone = getHeader('x-vercel-ip-timezone')

    if (cdnCountry) {
      return {
        country: cdnCountry,
        countryCode: cdnCountry,
        region: cdnRegion ? decodeURIComponent(cdnRegion) : undefined,
        city: cdnCity ? decodeURIComponent(cdnCity) : undefined,
        latitude: cdnLat ? parseFloat(cdnLat) : undefined,
        longitude: cdnLon ? parseFloat(cdnLon) : undefined,
        timezone: cdnTimezone ? decodeURIComponent(cdnTimezone) : undefined,
      }
    }
  }

  // 2. Handle private/loopback addresses in local development
  if (isLocalOrPrivateIp(ip)) {
    return {
      country: 'Localhost',
      countryCode: 'LOCAL',
      region: 'Development',
      city: 'Local Machine',
    }
  }

  const ipHash = hashIp(ip)
  const cacheKey = `portfolio:geo:${ipHash}`

  // 3. Check Redis cache
  if (redis) {
    try {
      const cached = await redis.get<VisitorLocation | string>(cacheKey)
      if (cached) {
        if (typeof cached === 'string') {
          try {
            return JSON.parse(cached) as VisitorLocation
          } catch {}
        } else if (typeof cached === 'object') {
          return cached as VisitorLocation
        }
      }
    } catch {
      // Redis error, proceed to network lookup
    }
  }

  // 4. Perform external lookup with strict timeout (1200ms)
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 1200)

    // Using ipwho.is (fast, HTTPS, free for low-volume portfolio telemetry, no API key required)
    const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'PortfolioAnalytics/1.0',
        Accept: 'application/json',
      },
    })
    clearTimeout(timeout)

    if (res.ok) {
      const data = await res.json()
      if (data && data.success !== false && data.country) {
        const location: VisitorLocation = {
          country: data.country || undefined,
          countryCode: data.country_code || undefined,
          region: data.region || undefined,
          city: data.city || undefined,
          latitude: typeof data.latitude === 'number' ? Math.round(data.latitude * 100) / 100 : undefined,
          longitude: typeof data.longitude === 'number' ? Math.round(data.longitude * 100) / 100 : undefined,
          timezone: data.timezone?.id || undefined,
        }

        // Cache in Redis for 7 days (604800 seconds)
        if (redis) {
          redis.set(cacheKey, JSON.stringify(location), { ex: 604800 }).catch(() => {})
        }

        return location
      }
    }
  } catch (geoError) {
    // Fail open: log for debugging without crashing or interrupting the track flow
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[Geolocation] Lookup failed or timed out:', geoError)
    }
  }

  return null
}
