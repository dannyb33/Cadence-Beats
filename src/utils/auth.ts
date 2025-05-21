import { SPOTIFY_AUTH_ENDPOINT, SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI, SPOTIFY_SCOPES } from "../config/spotify";
import { SpotifyToken } from "../types/spotify";

// Generate random string for state parameter
export const generateRandomString = (length: number): string => {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values)
    .map(x => possible[x % possible.length])
    .join("");
};

// Create authorization URL for Spotify login
export const getAuthorizationUrl = (): string => {
  const state = generateRandomString(16);
  localStorage.setItem("spotify_auth_state", state);

  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: SPOTIFY_REDIRECT_URI,
    state,
    scope: SPOTIFY_SCOPES.join(" "),
  });

  return `${SPOTIFY_AUTH_ENDPOINT}?${params.toString()}`;
};

// Exchange code for access token
export const exchangeCodeForToken = async (code: string): Promise<SpotifyToken> => {
  const params = new URLSearchParams({
    code,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    grant_type: "authorization_code",
  });

  const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`,
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange code for token");
  }

  const data = await response.json();
  
  // Add expiration timestamp
  const expiresAt = Date.now() + data.expires_in * 1000;
  const token: SpotifyToken = {
    ...data,
    expires_at: expiresAt,
  };

  return token;
};

// Save token to localStorage
export const saveToken = (token: SpotifyToken): void => {
  localStorage.setItem("spotify_token", JSON.stringify(token));
};

// Get token from localStorage
export const getToken = (): SpotifyToken | null => {
  const tokenString = localStorage.getItem("spotify_token");
  if (!tokenString) return null;
  
  try {
    return JSON.parse(tokenString) as SpotifyToken;
  } catch {
    return null;
  }
};

// Check if token is valid (not expired)
export const isTokenValid = (token: SpotifyToken | null): boolean => {
  if (!token || !token.expires_at) return false;
  return token.expires_at > Date.now();
};

// Refresh token
export const refreshToken = async (refresh_token: string): Promise<SpotifyToken> => {
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token,
  });

  const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`,
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  const data = await response.json();
  
  // Add expiration timestamp
  const expiresAt = Date.now() + data.expires_in * 1000;
  const token: SpotifyToken = {
    ...data,
    refresh_token: refresh_token, // Keep existing refresh token if not returned
    expires_at: expiresAt,
  };

  return token;
};

// Get a valid token (refresh if needed)
export const getValidToken = async (): Promise<string | null> => {
  const token = getToken();
  
  if (!token) return null;
  
  if (isTokenValid(token)) {
    return token.access_token;
  }
  
  if (token.refresh_token) {
    try {
      const newToken = await refreshToken(token.refresh_token);
      saveToken(newToken);
      return newToken.access_token;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  }
  
  return null;
};

// Clear token from localStorage
export const clearToken = (): void => {
  localStorage.removeItem("spotify_token");
};

// Get token from URL (after redirect)
export const getTokenFromUrl = (): { code: string | null; state: string | null } => {
  const params = new URLSearchParams(window.location.search);
  return {
    code: params.get("code"),
    state: params.get("state"),
  };
};