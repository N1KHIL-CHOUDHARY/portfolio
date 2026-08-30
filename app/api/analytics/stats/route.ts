import { NextResponse } from 'next/server'
import { getAnalyticsSummary } from '@/lib/analytics'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const summary = await getAnalyticsSummary()
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
  } catch (error) {
    console.error('[Analytics Stats API Error]:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics summary' },
      { status: 500 }
    )
  }
}
