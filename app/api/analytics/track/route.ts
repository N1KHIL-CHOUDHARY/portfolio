import { NextRequest, NextResponse } from 'next/server'
import { trackPageView } from '@/lib/analytics'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    let body: any = {}
    try {
      body = await req.json()
    } catch {
      // Body may be empty if sent via beacon or query
    }

    const path = body?.path || req.nextUrl.searchParams.get('path') || '/'
    const referrer = body?.referrer || req.headers.get('referer') || ''
    const userAgent = req.headers.get('user-agent') || ''

    // Extract real client IP across reverse proxies (Vercel, Cloudflare, AWS, Nginx)
    const forwardedFor = req.headers.get('x-forwarded-for')
    const realIp = req.headers.get('x-real-ip') || req.headers.get('cf-connecting-ip')
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '127.0.0.1'

    // Extract geo headers if provided by CDN (e.g. Vercel)
    const country = req.headers.get('x-vercel-ip-country') || ''
    const city = req.headers.get('x-vercel-ip-city') || ''

    // Retrieve or generate persistent visitor ID from cookies or payload
    let visitorId = req.cookies.get('pv_vid')?.value || body?.visitorId
    let isNewVisitor = false

    if (!visitorId) {
      visitorId = crypto.randomUUID()
      isNewVisitor = true
    }

    const result = await trackPageView({
      path,
      visitorId,
      ip,
      userAgent,
      referrer,
      country,
      city,
    })

    const response = NextResponse.json(
      {
        success: true,
        isUnique: result.isUnique,
        totalViews: result.totalViews,
        uniqueVisitors: result.uniqueVisitors,
        pathViews: result.pathViews,
      },
      { status: 200 }
    )

    // Set 1-year anonymous visitor cookie
    if (isNewVisitor || !req.cookies.get('pv_vid')) {
      response.cookies.set('pv_vid', visitorId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })
    }

    return response
  } catch (error) {
    console.error('[Analytics API Error]:', error)
    return NextResponse.json(
      { success: false, error: 'Internal analytics error' },
      { status: 500 }
    )
  }
}
