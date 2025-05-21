import React from 'react';
import SongCard from './SongCard';
import { Song } from '../types';
import { Music } from 'lucide-react';

interface SongListProps {
  songs: Song[];
  isLoading: boolean;
  error: string | null;
}

const SongList: React.FC<SongListProps> = ({ songs, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-12">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 mb-4 rounded-full bg-purple-200"></div>
          <div className="h-4 w-32 mb-3 rounded bg-purple-200"></div>
          <div className="h-3 w-24 rounded bg-purple-100"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto bg-white bg-opacity-90 backdrop-blur-lg rounded-xl shadow-md p-6 text-center">
        <div className="text-red-500 mb-2">
          <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto bg-white bg-opacity-90 backdrop-blur-lg rounded-xl shadow-md p-8 text-center">
        <Music className="w-12 h-12 mx-auto text-purple-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-800 mb-2">No songs found</h3>
        <p className="text-gray-600">Try a different BPM or check back later.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Matching Songs</h2>
      <div className="grid grid-cols-1 gap-6">
        {songs.map((song, index) => (
          <SongCard key={song.id} song={song} index={index} />
        ))}
      </div>
    </div>
  );
};

export default SongList;