import { NextRequest, NextResponse } from 'next/server'
import { trackPageView } from '@/lib/analytics'
import { extractClientIp } from '@/lib/geo'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    let body: any = {}
    try {
      body = await req.json()
    } catch {
      // Body may be empty if sent via navigator.sendBeacon
    }

    const path = body?.path || req.nextUrl.searchParams.get('path') || '/'
    const referrer = body?.referrer || req.headers.get('referer') || ''
    const userAgent = req.headers.get('user-agent') || ''

    // Extract real client IP securely
    const ip = extractClientIp(req.headers)

    // Optional CDN geo hints
    const country = req.headers.get('x-vercel-ip-country') || ''
    const city = req.headers.get('x-vercel-ip-city') || ''

    const result = await trackPageView({
      path,
      ip,
      userAgent,
      referrer,
      country,
      city,
      headers: req.headers,
    })

    return NextResponse.json(
      {
        success: true,
        isUnique: result.isUnique,
        totalViews: result.totalViews,
        uniqueVisitors: result.uniqueVisitors,
        pathViews: result.pathViews,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )
  } catch (error) {
    console.error('[Analytics View API Error]:', error)
    return NextResponse.json(
      { success: false, error: 'Internal analytics error' },
      { status: 500 }
    )
  }
}
