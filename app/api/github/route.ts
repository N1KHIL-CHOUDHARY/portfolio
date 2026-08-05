import { NextResponse } from 'next/server'
import { getGithubData } from '@/lib/github'

export const revalidate = 3600

export async function GET() {
  const data = await getGithubData()
  return NextResponse.json(data)
}
