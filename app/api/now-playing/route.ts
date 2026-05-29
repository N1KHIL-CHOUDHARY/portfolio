import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export const dynamic = 'force-dynamic';
const redis = Redis.fromEnv();

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
    headers: { Authorization: `Bearer ${access_token}` },
    cache: 'no-store',
  });

  if (response.status === 200) {
    const song = await response.json();
    if (song.item) {
      const data = {
        isPlaying: song.is_playing,
        title: song.item.name,
        artist: song.item.artists.map((a: any) => a.name).join(', '),
        albumImageUrl: song.item.album.images[0].url,
        songUrl: song.item.external_urls.spotify,
        progress: song.progress_ms || 0,
        duration: song.item.duration_ms || 0,
      };
      await redis.set('last-song', JSON.stringify(data));
      return NextResponse.json(data);
    }
  }

  if (response.status === 204) {
  const lastSong = await redis.get('last-song');

  const parsed =
    typeof lastSong === 'string'
      ? JSON.parse(lastSong)
      : lastSong;

  return NextResponse.json(
    parsed
      ? {
          ...parsed,
          isPlaying: false,
          progress: parsed.duration || parsed.progress || 0,
        }
      : {
          isPlaying: false,
          title: 'No track',
          artist: '-',
          albumImageUrl: '',
          progress: 0,
          duration: 0,
        }
  );
}


const lastSong = await redis.get('last-song');

const parsed =
  typeof lastSong === 'string'
    ? JSON.parse(lastSong)
    : lastSong;

if (parsed) {
  return NextResponse.json({
    ...parsed,
    isPlaying: false,
    progress: parsed.duration || parsed.progress || 0,
  });
}

return NextResponse.json({
  isPlaying: false,
  title: 'No track',
  artist: '-',
  albumImageUrl: '',
  progress: 0,
  duration: 0,
});
}