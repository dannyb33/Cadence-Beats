import axios from 'axios';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { Song } from '../types';

const BPM_API_KEY = import.meta.env.VITE_GETSONGBPM_API_KEY;
const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

const BPM_URL = 'https://api.getsong.co/';

const spotify = SpotifyApi.withClientCredentials(
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET
);

async function fetchSongsFromBPMApi(bpm: number, limit: number): Promise<{ title: string; artist: string }[]> {
  const response = await axios.get(`${BPM_URL}/tempo/`, {
    params: {
      api_key: BPM_API_KEY,
      bpm: bpm,
      limit: limit
    }
  });

  return response.data.tempo.map((song: { song_title: string, artist: { name: string }[] }) => {
    const artistName = song.artist?.[0]?.name ?? "Unknown Artist";
    return {
      title: song.song_title,
      artist: artistName
    };
  });
}

async function searchOnSpotify(title: string, artist?: string): Promise<Song | null> {
  try {
    const sdk = await spotify;
    // Search with both title and artist if artist is provided
    const query = `${title} ${artist}`;
    const result = await sdk.search(query, ["track"]);
    const track = result.tracks.items[0];

    if (!track) return null;

    return {
      id: track.id,
      name: track.name,
      artists: track.artists.map(artist => ({
        id: artist.id,
        name: artist.name
      })),
      album: track.album ? {
        id: track.album.id,
        name: track.album.name,
        images: track.album.images
      } : undefined,
      preview_url: track.preview_url || undefined,
      popularity: track.popularity
    };
  } catch (error) {
    console.error('Error searching on Spotify:', error);
    return null;
  }
}

export async function fetchSongsByBPM(bpm: number, limit: number): Promise<Song[]> {
  try {
    const songs = await fetchSongsFromBPMApi(bpm, limit); // [{ title, artist }...]
    
    const tracks: Song[] = [];

    for (const { title, artist } of songs) {
      const result = await searchOnSpotify(title, artist);
      if (result) {
        tracks.push(result);
      }
    }

    return tracks
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 5);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch songs: ${error.message}`);
    }
    throw new Error('An unknown error occurred');
  }
}

// For development/testing without the backend
export async function mockFetchSongsByBPM(): Promise<Song[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          name: 'Shape of You',
          artists: [{ id: 'a1', name: 'Ed Sheeran' }],
          album: {
            id: 'alb1',
            name: '÷ (Divide)',
            images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96', height: 640, width: 640 }]
          },
          preview_url: 'https://p.scdn.co/mp3-preview/84462d8e1e4d0f9e5ccd06f0da390f65843774a2',
          popularity: 98
        },
        {
          id: '2',
          name: 'Blinding Lights',
          artists: [{ id: 'a2', name: 'The Weeknd' }],
          album: {
            id: 'alb2',
            name: 'After Hours',
            images: [{ url: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36', height: 640, width: 640 }]
          },
          preview_url: 'https://p.scdn.co/mp3-preview/8b6e544b5625e7f1a3a9b8882a64962db5879a31',
          popularity: 95
        },
        {
          id: '3',
          name: 'Dance Monkey',
          artists: [{ id: 'a3', name: 'Tones and I' }],
          album: {
            id: 'alb3',
            name: 'The Kids Are Coming',
            images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273c6f7af36530731ae7a7e4c7a', height: 640, width: 640 }]
          },
          preview_url: 'https://p.scdn.co/mp3-preview/8742e0c607cd58706b5cc99e22b1fa8885c29b4f',
          popularity: 92
        }
      ]);
    }, 1500);
  });
}