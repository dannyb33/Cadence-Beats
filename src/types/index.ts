export interface Artist {
  id: string;
  name: string;
}

export interface Image {
  url: string;
  height: number;
  width: number;
}

export interface Album {
  id: string;
  name: string;
  images: Image[];
}

export interface Song {
  id: string;
  name: string;
  artists: Artist[];
  album?: Album;
  preview_url?: string;
  popularity: number;
  bpm?: number;
  ext_url: string;
}

export interface Run {
  id: string;
  date: string;
  duration: number;
  avgBPM: number;
  songsPlayed: number;
}