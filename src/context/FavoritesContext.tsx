import React, { createContext, useContext, useState, useEffect } from 'react';
import { Song } from '../types';

interface FavoritesContextType {
  favorites: Song[];
  addToFavorites: (song: Song) => void;
  removeFromFavorites: (songId: string) => void;
  isFavorite: (songId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Song[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (song: Song) => {
    // Ensure we keep the BPM that was set when the song was favorited
    const songWithBpm = {
      ...song,
      bpm: song.bpm || 120 // Fallback to 120 if somehow bpm is not set
    };
    setFavorites(prev => [...prev, songWithBpm]);
  };

  const removeFromFavorites = (songId: string) => {
    setFavorites(prev => prev.filter(song => song.id !== songId));
  };

  const isFavorite = (songId: string) => {
    return favorites.some(song => song.id === songId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}