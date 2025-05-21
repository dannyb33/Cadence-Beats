import { SpotifyToken, SpotifyTrack } from "./spotify";

declare module 'react-router-dom' {
  export function useNavigate(): (path: string) => void;
}

interface Window {
  Spotify: {
    Player: new (options: any) => any;
  };
  onSpotifyWebPlaybackSDKReady: () => void;
}