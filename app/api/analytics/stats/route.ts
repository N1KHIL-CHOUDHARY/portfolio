import { NextRequest, NextResponse } from 'next/server'
import { getAnalyticsSummary, getLiveAnalyticsSummary, triggerViewCountRevalidation } from '@/lib/analytics'
import { getAdminSession } from '@/lib/session'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: NextRequest) {
  try {
    const isForceRefresh =
      req.nextUrl.searchParams.get('refresh') === 'true' ||
      req.nextUrl.searchParams.get('refresh') === '1'
    const session = await getAdminSession()
    const isAdmin = Boolean(session)

    if (isForceRefresh && isAdmin) {
      triggerViewCountRevalidation()
    }

    const summary =
      isForceRefresh && isAdmin
        ? await getLiveAnalyticsSummary()
        : await getAnalyticsSummary()

    // If authenticated admin: return full telemetry with visitor locations and logs
    if (isAdmin) {
      return NextResponse.json(
        {
          success: true,
          data: summary,
        },
        {
          status: 200,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
          },
        }
      )
    }

    // Public / unauthenticated callers (e.g. Hero Section badge): return only public aggregates
    return NextResponse.json(
      {
        success: true,
        data: {
          totalViews: summary.totalViews,
          uniqueVisitors: summary.uniqueVisitors,
          todayViews: summary.todayViews,
          redisConnected: summary.redisConnected,
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )
  } catch (error) {
    console.error('[Analytics Stats API Error]:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics summary' },
      { status: 500 }
    )
  }
}
