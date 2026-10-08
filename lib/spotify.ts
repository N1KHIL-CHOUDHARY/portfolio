const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN

const BASIC_AUTH = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing'
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=1'

export interface SpotifyTrackResponse {
  isPlaying: boolean
  title: string
  artist: string
  album: string
  albumImageUrl: string
  songUrl: string
}

async function getAccessToken(): Promise<string | null> {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) return null

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${BASIC_AUTH}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: REFRESH_TOKEN,
      }),
      cache: 'no-store',
    })

    const data = await response.json()
    return data.access_token || null
  } catch {
    return null
  }
}

export async function getSpotifyStatus(): Promise<SpotifyTrackResponse> {
  const fallbackTrack: SpotifyTrackResponse = {
    isPlaying: false,
    title: 'Not Listening',
    artist: 'Spotify Offline',
    album: '',
    albumImageUrl: '',
    songUrl: 'https://open.spotify.com',
  }

  const accessToken = await getAccessToken()
  if (!accessToken) return fallbackTrack

  try {
    // 1. Try currently playing endpoint
    const currentRes = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    })

    if (currentRes.status === 200) {
      const song = await currentRes.json()
      if (song.item) {
        return {
          isPlaying: song.is_playing ?? true,
          title: song.item.name,
          artist: song.item.artists?.map((a: { name: string }) => a.name).join(', ') || 'Unknown Artist',
          album: song.item.album?.name || '',
          albumImageUrl: song.item.album?.images?.[0]?.url || '',
          songUrl: song.item.external_urls?.spotify || 'https://open.spotify.com',
        }
      }
    }

    // 2. Fallback: retrieve the most recently played track
    const recentRes = await fetch(RECENTLY_PLAYED_ENDPOINT, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    })

    if (recentRes.status === 200) {
      const recentData = await recentRes.json()
      const item = recentData.items?.[0]?.track
      if (item) {
        return {
          isPlaying: false,
          title: item.name,
          artist: item.artists?.map((a: { name: string }) => a.name).join(', ') || 'Unknown Artist',
          album: item.album?.name || '',
          albumImageUrl: item.album?.images?.[0]?.url || '',
          songUrl: item.external_urls?.spotify || 'https://open.spotify.com',
        }
      }
    }
  } catch (error) {
    console.error('Spotify API fetch error:', error)
  }

  return fallbackTrack
}

// Alias export so both function names resolve properly
export const getNowPlaying = getSpotifyStatus