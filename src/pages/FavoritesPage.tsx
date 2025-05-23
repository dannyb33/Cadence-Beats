import React, { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import SongCard from '../components/SongCard';
import { useQueue } from '../context/QueueContext';
import { Heart, Music2, ArrowUpDown } from 'lucide-react';

const FavoritesPage: React.FC = () => {
  const { favorites } = useFavorites();
  const { addToQueue } = useQueue();
  const [sortAscending, setSortAscending] = useState(true);

  const sortedFavorites = [...favorites].sort((a, b) => {
    const bpmA = a.bpm || 0;
    const bpmB = b.bpm || 0;
    return sortAscending ? bpmA - bpmB : bpmB - bpmA;
  });

  if (sortedFavorites.length === 0) {
    return (
      <div className="mt-12 text-center">
        <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Favorites Yet</h2>
        <p className="text-gray-600">
          Start adding songs to your favorites by clicking the heart icon on any song.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Favorites</h1>
        <button
          onClick={() => setSortAscending(!sortAscending)}
          className="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        >
          <ArrowUpDown className="w-4 h-4 mr-2 text-orange-500" />
          <span className="text-gray-700">
            Sort by BPM: {sortAscending ? 'Low to High' : 'High to Low'}
          </span>
        </button>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {sortedFavorites.map((song, index) => (
          <div key={song.id} className="relative">
            <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
              <Music2 className="w-4 h-4 text-orange-500 mr-2" />
              <span className="font-semibold text-gray-800">{song.bpm} BPM</span>
            </div>
            <SongCard
              song={song}
              index={index}
              onAddToQueue={addToQueue}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavoritesPage;