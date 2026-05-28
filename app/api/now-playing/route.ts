import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // CRITICAL: Forces fresh data

const getAccessToken = async () => {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN as string,
    }),
  });

  return response.json();
};

export async function GET() {
  const { access_token } = await getAccessToken();

  const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: 'no-store', // Extra protection against caching
  });

  if (response.status === 204 || response.status > 400) {
    return NextResponse.json({ isPlaying: false });
  }

  const song = await response.json();
  
  if (!song.item) {
    return NextResponse.json({ isPlaying: false });
  }

return NextResponse.json({
    isPlaying: song.is_playing,
    title: song.item.name,
    artist: song.item.artists.map((a: any) => a.name).join(', '),
    albumImageUrl: song.item.album.images[0].url,
    songUrl: song.item.external_urls.spotify,
    progress: song.progress_ms,    // Add this
    duration: song.item.duration_ms // Add this
  });
}