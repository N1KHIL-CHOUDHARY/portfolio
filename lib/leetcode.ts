import { DayData, GitHubResponse } from './github'

export async function getLeetCodeData(): Promise<GitHubResponse> {
  const username = process.env.LEETCODE_USERNAME || process.env.NEXT_PUBLIC_LEETCODE_USERNAME

  if (!username) {
    return {
      weeks: [],
      totalContributions: 0,
      currentStreak: 0,
      maxStreak: 0,
      isLive: false,
      error: 'Missing LEETCODE_USERNAME configuration',
    }
  }

  const query = `
    query userProfileCalendar($username: String!) {
      matchedUser(username: $username) {
        submitStats: submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
        userCalendar {
          streak
          totalActiveDays
          submissionCalendar
        }
      }
    }
  `

  try {
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
      next: { revalidate: 3600, tags: ['leetcode-data'] },
    })

    if (!res.ok) {
      throw new Error(`LeetCode API returned status ${res.status}`)
    }

    const json = await res.json()

    if (json.errors && Array.isArray(json.errors) && json.errors.length > 0) {
      throw new Error(json.errors[0]?.message || 'GraphQL API query error')
    }

    const matchedUser = json.data?.matchedUser
    if (!matchedUser) {
      throw new Error('LeetCode user not found')
    }

    const userCalendar = matchedUser.userCalendar || {}
    const submissionCalendar: Record<string, number> = userCalendar.submissionCalendar 
      ? JSON.parse(userCalendar.submissionCalendar) 
      : {}

    const weeks: DayData[][] = []
    const today = new Date()

    for (let w = 51; w >= 0; w--) {
      const week: DayData[] = []
      for (let d = 0; d < 7; d++) {
        const dateObj = new Date(today)
        dateObj.setDate(dateObj.getDate() - (w * 7 + (6 - d)))

        const utcDate = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()))
        const timestamp = Math.floor(utcDate.getTime() / 1000).toString()
        const count = submissionCalendar[timestamp] || 0

        let level: 0 | 1 | 2 | 3 | 4 = 0
        if (count >= 5) level = 4
        else if (count >= 3) level = 3
        else if (count >= 2) level = 2
        else if (count >= 1) level = 1

        const dateStr = dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })

        week.push({
          date: dateStr,
          rawDate: dateObj.toISOString(),
          count,
          level,
        })
      }
      weeks.push(week)
    }

    const totalSolved = matchedUser.submitStats?.acSubmissionNum?.find(
      (item: any) => item.difficulty === 'All'
    )?.count || 0

    return {
      weeks,
      totalContributions: totalSolved,
      currentStreak: userCalendar.streak || 0,
      maxStreak: userCalendar.streak || 0,
      isLive: true,
      username,
    }
  } catch (err: any) {
    console.error('LeetCode GraphQL fetch exception:', err)
    return {
      weeks: [],
      totalContributions: 0,
      currentStreak: 0,
      maxStreak: 0,
      isLive: false,
      error: err?.message || 'Network error fetching LeetCode data',
    }
  }
}