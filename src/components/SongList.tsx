import React from 'react';
import SongCard from './SongCard';
import { Song } from '../types';
import { Music, RefreshCw, Plus, Minus } from 'lucide-react';

interface SongListProps {
  songs: Song[];
  isLoading: boolean;
  error: string | null;
  onBpmChange: (newBpm: number) => void;
  currentBpm: number;
  onRefresh: () => void;
  onAddToQueue: (song: Song) => void;
}

const SongList: React.FC<SongListProps> = ({ 
  songs, 
  isLoading, 
  error, 
  onBpmChange,
  currentBpm,
  onRefresh,
  onAddToQueue
}) => {
  const adjustBpm = (adjustment: number) => {
    const newBpm = Math.min(Math.max(currentBpm + adjustment, 60), 200);
    onBpmChange(newBpm);
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-12">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 mb-4 rounded-full bg-orange-200"></div>
          <div className="h-4 w-32 mb-3 rounded bg-orange-200"></div>
          <div className="h-3 w-24 rounded bg-orange-100"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto bg-white bg-opacity-90 backdrop-blur-lg rounded-xl shadow-md p-6 text-center">
        <div className="text-red-500 mb-2">
          <Music className="w-10 h-10 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto bg-white bg-opacity-90 backdrop-blur-lg rounded-xl shadow-md p-8 text-center">
        <Music className="w-12 h-12 mx-auto text-orange-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-800 mb-2">No songs found</h3>
        <p className="text-gray-600">Try a different BPM or check back later.</p>
        <button
          onClick={onRefresh}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center mx-auto"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh List
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Matching Songs</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh List
          </button>
        </div>
      </div>

      <div className="mb-6 flex justify-center space-x-4">
        <button
          onClick={() => adjustBpm(-5)}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
          disabled={currentBpm <= 60}
        >
          <Minus className="w-4 h-4 mr-2" />
          Decrease BPM (-5)
        </button>
        <button
          onClick={() => adjustBpm(5)}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
          disabled={currentBpm >= 200}
        >
          <Plus className="w-4 h-4 mr-2" />
          Increase BPM (+5)
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {songs.map((song, index) => (
          <SongCard 
            key={song.id}
            song={song} 
            index={index}
            onAddToQueue={onAddToQueue}
          />
        ))}
      </div>
    </div>
  );
};

export default SongList;