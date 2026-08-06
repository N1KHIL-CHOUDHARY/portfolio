import { NextResponse } from 'next/server'
import { getGithubData } from '@/lib/github'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function GET() {
  try {
    const data = await getGithubData()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[GitHub API Route Error]:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch GitHub activity' },
      { status: 500 }
    )
  }
}
