import { Redis } from '@upstash/redis'

// Global singleton instance for Redis in Next.js development / serverless
const globalForRedis = globalThis as unknown as {
  redisClient: Redis | null | undefined
}

function createRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[Redis] UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is not configured.')
    }
    return null
  }

  try {
    return new Redis({
      url,
      token,
    })
  } catch (error) {
    console.error('[Redis] Failed to initialize Redis client:', error)
    return null
  }
}

export const redis = globalForRedis.redisClient ?? createRedisClient()

if (process.env.NODE_ENV !== 'production' && redis) {
  globalForRedis.redisClient = redis
}
