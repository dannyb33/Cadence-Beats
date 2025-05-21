import axios from "axios";
import { SPOTIFY_API_ENDPOINT } from "../config/spotify";
import { getValidToken } from "../utils/auth";
import { SpotifyDevice, SpotifyTrack } from "../types/spotify";

// Create an axios instance for Spotify API
const createApiClient = async () => {
  const token = await getValidToken();
  if (!token) throw new Error("No valid token available");
  
  return axios.create({
    baseURL: SPOTIFY_API_ENDPOINT,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get user's profile
export const getUserProfile = async () => {
  const api = await createApiClient();
  const response = await api.get("/me");
  return response.data;
};

// Get user's devices
export const getDevices = async (): Promise<SpotifyDevice[]> => {
  const api = await createApiClient();
  const response = await api.get("/me/player/devices");
  return response.data.devices;
};

// Get currently playing track
export const getCurrentlyPlaying = async (): Promise<SpotifyTrack | null> => {
  try {
    const api = await createApiClient();
    const response = await api.get("/me/player/currently-playing");
    return response.data?.item || null;
  } catch (error) {
    console.error("Error getting currently playing:", error);
    return null;
  }
};

// Get recently played tracks
export const getRecentlyPlayed = async (limit = 10): Promise<SpotifyTrack[]> => {
  try {
    const api = await createApiClient();
    const response = await api.get(`/me/player/recently-played?limit=${limit}`);
    return response.data.items.map((item: any) => item.track);
  } catch (error) {
    console.error("Error getting recently played:", error);
    return [];
  }
};

// Transfer playback to a device
export const transferPlayback = async (deviceId: string): Promise<void> => {
  const api = await createApiClient();
  await api.put("/me/player", {
    device_ids: [deviceId],
    play: true,
  });
};

// Play a track
export const playTrack = async (uri: string, deviceId: string): Promise<void> => {
  const api = await createApiClient();
  await api.put(`/me/player/play?device_id=${deviceId}`, {
    uris: [uri],
  });
};