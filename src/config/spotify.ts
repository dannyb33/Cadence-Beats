export const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || "f8bdbd633e9641a9b5e958540c3bd90e";
export const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || "523c093f21f4485abfaa79f51fdeeb91";
export const SPOTIFY_REDIRECT_URI = "http://127.0.0.1:5173/callback";
export const SPOTIFY_AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
export const SPOTIFY_TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
export const SPOTIFY_API_ENDPOINT = "https://api.spotify.com/v1";

// Scopes needed for the player and API access
export const SPOTIFY_SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-recently-played",
];