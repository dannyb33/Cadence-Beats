/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GETSONGBPM_API_KEY: string;
  readonly VITE_SPOTIFY_CLIENT_ID: string;
  readonly VITE_SPOTIFY_CLIENT_SECRET: string;
  // add more env vars here if you use others
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}