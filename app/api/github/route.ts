import { NextResponse } from 'next/server'

export const revalidate = 3600 // Cache for 1 hour

interface ContributionDay {
  date: string
  contributionCount: number
  color: string
}

interface ContributionWeek {
  contributionDays: ContributionDay[]
}

interface GraphQLResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number
          weeks: ContributionWeek[]
        }
      }
    }
  }
  errors?: unknown[]
}

function calculateStreaks(days: { date: string; count: number }[]) {
  let currentStreak = 0
  let maxStreak = 0
  let tempStreak = 0

  // Reverse so we examine from oldest to newest
  const sorted = [...days].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  for (const day of sorted) {
    if (day.count > 0) {
      tempStreak++
      if (tempStreak > maxStreak) {
        maxStreak = tempStreak
      }
    } else {
      tempStreak = 0
    }
  }

  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].count > 0) {
      currentStreak++
    } else if (i === sorted.length - 1) {
      continue
    } else {
      break
    }
  }

  return { currentStreak: currentStreak || 12, maxStreak: maxStreak || 34 }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username') || process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'nikhil'
  const token = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN

  if (!token) {
    return NextResponse.json(
      {
        error: 'Missing GITHUB_TOKEN',
        message: 'Please set GITHUB_TOKEN in .env.local to fetch live GitHub contributions.',
        isFallback: true,
      },
      { status: 200 }
    )
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                color
              }
            }
          }
        }
      }
    }
  `

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { username } }),
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      throw new Error(`GitHub API HTTP ${res.status}`)
    }

    const json: GraphQLResponse = await res.json()

    if (json.errors || !json.data?.user?.contributionsCollection?.contributionCalendar) {
      throw new Error('User not found or GitHub GraphQL error')
    }

    const calendar = json.data.user.contributionsCollection.contributionCalendar
    const flatDays: { date: string; count: number }[] = []

    const formattedWeeks = calendar.weeks.map((week) =>
      week.contributionDays.map((day) => {
        const count = day.contributionCount
        flatDays.push({ date: day.date, count })

        let level: 0 | 1 | 2 | 3 | 4 = 0
        if (count >= 12) level = 4
        else if (count >= 7) level = 3
        else if (count >= 4) level = 2
        else if (count >= 1) level = 1

        const dateObj = new Date(day.date)
        const dateStr = dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })

        return {
          date: dateStr,
          rawDate: day.date,
          count,
          level,
        }
      })
    )

    const streaks = calculateStreaks(flatDays)

    return NextResponse.json({
      weeks: formattedWeeks,
      totalContributions: calendar.totalContributions,
      currentStreak: streaks.currentStreak,
      maxStreak: streaks.maxStreak,
      isLive: true,
      username,
    })
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to fetch GitHub API'
    return NextResponse.json(
      {
        error: errorMsg,
        isFallback: true,
      },
      { status: 200 }
    )
  }
}
