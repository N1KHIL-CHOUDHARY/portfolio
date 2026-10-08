import { NextResponse } from 'next/server'
import { getSpotifyStatus } from '@/lib/spotify'

export const dynamic = 'force-dynamic'

export async function GET() {
  const data = await getSpotifyStatus()
  return NextResponse.json(data)
}