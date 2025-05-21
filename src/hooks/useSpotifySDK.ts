import { useState, useEffect, useCallback } from "react";
import { getValidToken } from "../utils/auth";
import { PlayerControls, SpotifyPlayerOptions, SpotifyPlayerState } from "../types/spotify";

declare global {
  interface Window {
    Spotify: {
      Player: new (options: SpotifyPlayerOptions) => any;
    };
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

export const useSpotifySDK = () => {
  const [player, setPlayer] = useState<any>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playerState, setPlayerState] = useState<SpotifyPlayerState | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load Spotify Web Playback SDK script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Initialize Spotify Player
  useEffect(() => {
    if (!window.Spotify) {
      window.onSpotifyWebPlaybackSDKReady = initializePlayer;
    } else {
      initializePlayer();
    }
    
    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, []);

  const initializePlayer = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const token = await getValidToken();
      if (!token) {
        setError("No valid token available");
        setIsLoading(false);
        return;
      }
      
      const player = new window.Spotify.Player({
        name: 'Spotify Web Player',
        getOAuthToken: (cb: (token: string) => void) => {
          cb(token);
        },
        volume: 0.5,
      });
      
      // Error handling
      player.addListener('initialization_error', ({ message }: { message: string }) => {
        console.error('Initialization error:', message);
        setError(`Initialization error: ${message}`);
        setIsLoading(false);
      });
      
      player.addListener('authentication_error', ({ message }: { message: string }) => {
        console.error('Authentication error:', message);
        setError(`Authentication error: ${message}`);
        setIsLoading(false);
      });
      
      player.addListener('account_error', ({ message }: { message: string }) => {
        console.error('Account error:', message);
        setError(`Account error: ${message}`);
        setIsLoading(false);
      });
      
      player.addListener('playback_error', ({ message }: { message: string }) => {
        console.error('Playback error:', message);
        setError(`Playback error: ${message}`);
      });
      
      // Ready handling
      player.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
        setIsReady(true);
        setIsLoading(false);
      });
      
      // Not ready handling
      player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
        console.log('Device ID has gone offline', device_id);
        setIsReady(false);
      });
      
      // Player state handling
      player.addListener('player_state_changed', (state: SpotifyPlayerState) => {
        if (state) {
          setPlayerState(state);
        }
      });
      
      // Connect the player
      await player.connect();
      setPlayer(player);
    } catch (err) {
      console.error('Error initializing player:', err);
      setError(err instanceof Error ? err.message : 'Unknown error initializing player');
      setIsLoading(false);
    }
  }, []);

  // Controls
  const controls: PlayerControls = {
    nextTrack: async () => {
      if (!player) throw new Error("Player not initialized");
      return player.nextTrack();
    },
    previousTrack: async () => {
      if (!player) throw new Error("Player not initialized");
      return player.previousTrack();
    },
    togglePlay: async () => {
      if (!player) throw new Error("Player not initialized");
      return player.togglePlay();
    },
    seek: async (position: number) => {
      if (!player) throw new Error("Player not initialized");
      return player.seek(position);
    },
    setVolume: async (volume: number) => {
      if (!player) throw new Error("Player not initialized");
      return player.setVolume(volume);
    },
  };

  return {
    player,
    deviceId,
    isReady,
    isLoading,
    playerState,
    error,
    controls,
  };
};