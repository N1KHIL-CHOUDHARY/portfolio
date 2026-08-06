export interface DayData {
  date: string
  rawDate?: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export interface GitHubResponse {
  weeks: DayData[][]
  totalContributions: number
  currentStreak: number
  maxStreak: number
  isLive: boolean
  username?: string
  error?: string
}

function getFallbackData(errorMsg?: string): GitHubResponse {
  const weeks: DayData[][] = []
  const today = new Date()
  for (let w = 51; w >= 0; w--) {
    const week: DayData[] = []
    for (let d = 0; d < 7; d++) {
      const dateObj = new Date(today)
      dateObj.setDate(dateObj.getDate() - (w * 7 + (6 - d)))
      const dateStr = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
      week.push({
        date: dateStr,
        count: 0,
        level: 0,
      })
    }
    weeks.push(week)
  }
  return {
    weeks,
    totalContributions: 0,
    currentStreak: 0,
    maxStreak: 0,
    isLive: false,
    error: errorMsg,
  }
}

function calculateStreaks(days: { date: string; count: number }[]) {
  let currentStreak = 0
  let maxStreak = 0
  let tempStreak = 0

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

  return { currentStreak, maxStreak }
}

export async function getGithubData(): Promise<GitHubResponse> {
  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || process.env.GITHUB_USERNAME
  const token = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN

  if (!username || !token) {
    return getFallbackData('Missing GitHub configuration variables')
  }

  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
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

  const now = new Date()
  const from = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString()
  const to = now.toISOString()

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username, from, to },
      }),
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      return getFallbackData(`GitHub API returned status ${res.status}`)
    }

    const json = await res.json()

    if (json.errors || !json.data?.user?.contributionsCollection?.contributionCalendar) {
      console.error('GitHub GraphQL Error:', json.errors)
      return getFallbackData(json.errors?.[0]?.message || 'Failed to parse contribution calendar')
    }

    const calendar = json.data.user.contributionsCollection.contributionCalendar
    const flatDays: { date: string; count: number }[] = []

    const formattedWeeks: DayData[][] = calendar.weeks.map((week: any) =>
      week.contributionDays.map((day: any) => {
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

    return {
      weeks: formattedWeeks,
      totalContributions: calendar.totalContributions,
      currentStreak: streaks.currentStreak,
      maxStreak: streaks.maxStreak,
      isLive: true,
      username,
    }
  } catch (err: any) {
    return getFallbackData(err.message || 'Network error fetching GitHub data')
  }
}