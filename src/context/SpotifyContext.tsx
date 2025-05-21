import React, { createContext, useContext, useState, useEffect } from "react";
import { SpotifyToken, SpotifyTrack } from "../types/spotify";
import { getToken, isTokenValid, clearToken } from "../utils/auth";
import { getCurrentlyPlaying, getRecentlyPlayed } from "../services/api";
import { useSpotifySDK } from "../hooks/useSpotifySDK";

interface SpotifyContextType {
  isAuthenticated: boolean;
  logout: () => void;
  isPlayerReady: boolean;
  deviceId: string | null;
  playerState: any;
  currentTrack: SpotifyTrack | null;
  isPlaying: boolean;
  recentTracks: SpotifyTrack[];
  controls: {
    play: () => Promise<void>;
    pause: () => Promise<void>;
    nextTrack: () => Promise<void>;
    previousTrack: () => Promise<void>;
    seek: (position: number) => Promise<void>;
    setVolume: (volume: number) => Promise<void>;
  };
}

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

export const SpotifyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [recentTracks, setRecentTracks] = useState<SpotifyTrack[]>([]);
  const { deviceId, isReady, playerState, controls } = useSpotifySDK();

  // Check if user is authenticated
  useEffect(() => {
    const token = getToken();
    setIsAuthenticated(isTokenValid(token));
  }, []);

  // Get currently playing track when player state changes
  useEffect(() => {
    if (playerState && playerState.track_window.current_track) {
      setCurrentTrack(playerState.track_window.current_track);
    } else {
      // If no player state, try to get currently playing from API
      const fetchCurrentTrack = async () => {
        const track = await getCurrentlyPlaying();
        if (track) setCurrentTrack(track);
      };
      
      if (isAuthenticated) {
        fetchCurrentTrack();
      }
    }
  }, [playerState, isAuthenticated]);

  // Get recently played tracks
  useEffect(() => {
    const fetchRecentTracks = async () => {
      if (isAuthenticated) {
        const tracks = await getRecentlyPlayed(10);
        setRecentTracks(tracks);
      }
    };
    
    fetchRecentTracks();
    
    // Refresh recent tracks every 30 seconds
    const interval = setInterval(fetchRecentTracks, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Logout function
  const logout = () => {
    clearToken();
    setIsAuthenticated(false);
  };

  // Enhanced controls
  const enhancedControls = {
    play: async () => {
      if (playerState?.paused) {
        await controls.togglePlay();
      }
    },
    pause: async () => {
      if (!playerState?.paused) {
        await controls.togglePlay();
      }
    },
    nextTrack: controls.nextTrack,
    previousTrack: controls.previousTrack,
    seek: controls.seek,
    setVolume: controls.setVolume,
  };

  return (
    <SpotifyContext.Provider
      value={{
        isAuthenticated,
        logout,
        isPlayerReady: isReady,
        deviceId,
        playerState,
        currentTrack,
        isPlaying: playerState ? !playerState.paused : false,
        recentTracks,
        controls: enhancedControls,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};

export const useSpotify = (): SpotifyContextType => {
  const context = useContext(SpotifyContext);
  if (context === undefined) {
    throw new Error("useSpotify must be used within a SpotifyProvider");
  }
  return context;
};