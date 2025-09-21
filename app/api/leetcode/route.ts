import { NextResponse } from 'next/server'
import { getLeetCodeData } from '@/lib/leetcode'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const data = await getLeetCodeData()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[LeetCode API Route Error]:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch LeetCode activity' },
      { status: 500 }
    )
  }
}
