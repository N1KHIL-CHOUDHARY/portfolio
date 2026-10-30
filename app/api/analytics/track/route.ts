import { NextRequest, NextResponse } from 'next/server'
import { trackPageView } from '@/lib/analytics'
import { extractClientIp } from '@/lib/geo'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    let body: any = {}
    try {
      body = await req.json()
    } catch {
      // Body may be empty if sent via beacon or URL query
    }

    const path = body?.path || req.nextUrl.searchParams.get('path') || '/'
    const referrer = body?.referrer || req.headers.get('referer') || ''
    const userAgent = req.headers.get('user-agent') || ''

    // Persistent visitor identification (body payload or existing cookie)
    const cookieVid = req.cookies.get('portfolio_vid')?.value
    const visitorId = body?.visitorId || cookieVid || crypto.randomUUID()

    // Extract real client IP securely across proxies (Vercel, Cloudflare, AWS, Nginx)
    const ip = extractClientIp(req.headers)

    // Optional CDN geo hints
    const country = req.headers.get('x-vercel-ip-country') || ''
    const city = req.headers.get('x-vercel-ip-city') || ''

    const result = await trackPageView({
      path,
      visitorId,
      ip,
      userAgent,
      referrer,
      country,
      city,
      headers: req.headers,
    })

    const response = NextResponse.json(
      {
        success: true,
        isUnique: result.isUnique,
        totalViews: result.totalViews,
        uniqueVisitors: result.uniqueVisitors,
        pathViews: result.pathViews,
        visitorId,
        location: result.location
          ? {
              country: result.location.country,
              city: result.location.city,
            }
          : undefined,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )

    if (!cookieVid && visitorId) {
      response.cookies.set('portfolio_vid', visitorId, {
        path: '/',
        maxAge: 315360000, // 10 years
        sameSite: 'lax',
        httpOnly: false,
      })
    }

    return response
  } catch (error) {
    console.error('[Analytics Track API Error]:', error)
    return NextResponse.json(
      { success: false, error: 'Internal analytics error' },
      { status: 500 }
    )
  }
}
