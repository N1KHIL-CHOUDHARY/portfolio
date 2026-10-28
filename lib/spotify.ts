import { unstable_cache } from 'next/cache'

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

// In-memory persistent fallback if Spotify returns 204 or goes offline
let lastKnownTrack: SpotifyTrackResponse = {
  isPlaying: false,
  title: 'Not Listening',
  artist: 'Spotify Offline',
  album: '',
  albumImageUrl: '',
  songUrl: 'https://open.spotify.com',
}

/**
 * 1. Cache Access Token using Next.js fetch cache (revalidates every 55 minutes)
 */
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
      // Native Next.js Data Cache: caches token for 3300 seconds (55 min)
      next: { revalidate: 3300, tags: ['spotify-token'] },
    })

    if (!response.ok) return null
    const data = await response.json()
    return data.access_token || null
  } catch {
    return null
  }
}

/**
 * Raw fetcher from Spotify API
 */
async function fetchSpotifyRaw(): Promise<SpotifyTrackResponse> {
  const accessToken = await getAccessToken()
  if (!accessToken) return lastKnownTrack

  try {
    // 1. Try currently playing
    const currentRes = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store', // Fresh check
    })

    if (currentRes.status === 200) {
      const song = await currentRes.json()
      if (song?.item) {
        const track: SpotifyTrackResponse = {
          isPlaying: song.is_playing ?? true,
          title: song.item.name,
          artist: song.item.artists?.map((a: { name: string }) => a.name).join(', ') || 'Unknown Artist',
          album: song.item.album?.name || '',
          albumImageUrl: song.item.album?.images?.[0]?.url || '',
          songUrl: song.item.external_urls?.spotify || 'https://open.spotify.com',
        }
        lastKnownTrack = { ...track, isPlaying: false }
        return track
      }
    }

    // 2. Try recently played
    const recentRes = await fetch(RECENTLY_PLAYED_ENDPOINT, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    })

    if (recentRes.status === 200) {
      const recentData = await recentRes.json()
      const item = recentData.items?.[0]?.track
      if (item) {
        const track: SpotifyTrackResponse = {
          isPlaying: false,
          title: item.name,
          artist: item.artists?.map((a: { name: string }) => a.name).join(', ') || 'Unknown Artist',
          album: item.album?.name || '',
          albumImageUrl: item.album?.images?.[0]?.url || '',
          songUrl: item.external_urls?.spotify || 'https://open.spotify.com',
        }
        lastKnownTrack = track
        return track
      }
    }
  } catch (error) {
    console.error('Spotify API fetch error:', error)
  }

  return lastKnownTrack
}


export const getSpotifyStatus = unstable_cache(
  async () => fetchSpotifyRaw(),
  ['spotify-status-cache'],
  {
    revalidate: 15, 
    tags: ['spotify-status'],
  }
)

export const getNowPlaying = getSpotifyStatus