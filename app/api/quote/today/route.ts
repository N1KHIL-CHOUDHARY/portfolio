import { NextResponse } from 'next/server'
import { getTodayQuote, getTodayQuoteRandom } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const isRandom = searchParams.get('random') === 'true'
    const quote = isRandom ? await getTodayQuoteRandom() : await getTodayQuote()

    return NextResponse.json(quote, {
      headers: {
        'Cache-Control': isRandom ? 'no-cache' : 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error: any) {
    console.error('[Quote API Route Error]:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch quote' },
      { status: 500 }
    )
  }
}
