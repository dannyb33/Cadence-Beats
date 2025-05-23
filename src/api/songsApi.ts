import axios from 'axios';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { Song } from '../types';

const BPM_API_KEY = import.meta.env.VITE_GETSONGBPM_API_KEY;
const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

const BPM_URL = 'https://api.getsong.co/';

// Initialize Spotify client as a promise to ensure it's ready before use
const spotifyClientPromise = SpotifyApi.withClientCredentials(
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

  return response.data.tempo.map((song: { song_title: string, artist: {name: string} }) => {
    const artistName = song.artist.name;

    return {
      title: song.song_title,
      artist: artistName
    };
  });
}

async function searchOnSpotify(title: string, artist?: string): Promise<Song | null> {
  try {
    // Ensure the Spotify client is initialized before use
    const sdk = await spotifyClientPromise;
    if (!sdk) {
      throw new Error('Failed to initialize Spotify client');
    }

    const query = artist ? `${title} ${artist}` : title;

    // Search with both title and artist if artist is provided
    const result = await sdk.search(query, ["track"]);
    
    if (!result?.tracks?.items?.length) return null;
    
    const track = result.tracks.items[0];

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
      popularity: track.popularity,
      ext_url: track.external_urls.spotify
    };
  } catch (error) {
    console.error('Error searching on Spotify:', error);
    if (error instanceof Error) {
      throw new Error(`Spotify search failed: ${error.message}`);
    }
    throw new Error('Spotify search failed: Unknown error');
  }
}

export async function fetchSongsByBPM(bpm: number, limit: number): Promise<Song[]> {
  try {
    const songs = await fetchSongsFromBPMApi(bpm, limit);

    const results = await Promise.all(
      songs.map(({ title, artist }) => searchOnSpotify(title, artist))
    );

    // Filter out nulls
    const nonNullResults = results.filter((song): song is Song => song !== null);

    // Deduplicate by (title, artist) combo
    const seen = new Set<string>();
    const uniqueTracks: Song[] = [];

    for (const song of nonNullResults) {
      const key = `${song.name.toLowerCase()}|${song.artists[0].name.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueTracks.push(song);
      }
    }

    return uniqueTracks
      .sort((a, b) => b.popularity - a.popularity);

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch songs: ${error.message}`);
    }
    throw new Error('An unknown error occurred');
  }
}

export async function searchSong(query: string): Promise<Song | null> {
  // Search on Spotify first
  const result = await searchOnSpotify(query);
  if (!result) return null;

  try {
    // Build the lookup string
    const lookup = `song:${encodeURIComponent(result.title)} artist:${encodeURIComponent(result.artists[0].name)}`;

    // Request BPM data
    const response = await axios.get(`${BPM_URL}/search/`, {
      params: {
        api_key: BPM_API_KEY,
        type: "both",
        lookup,
      }
    });

    const bpmData = response.data?.songs?.[0]?.bpm;
    if (bpmData) {
      return {
        ...result,
        bpm: bpmData
      };
    }

    return result; // Return the song without bpm if not found
  } catch (error) {
    console.error("Failed to fetch BPM data:", error);
    return result; // Return the song without bpm on failure
  }
}