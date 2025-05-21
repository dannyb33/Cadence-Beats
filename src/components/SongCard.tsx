import React, { useState, useRef } from 'react';
import { Play, Pause, Heart } from 'lucide-react';
import { Song } from '../types';

interface SongCardProps {
  song: Song;
  index: number;
}

const SongCard: React.FC<SongCardProps> = ({ song, index }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  // Animation delay based on index for staggered entrance
  const animationDelay = `${index * 150}ms`;

  return (
    <div 
      className="relative bg-white bg-opacity-80 backdrop-blur-md rounded-xl shadow-md overflow-hidden transform transition-all duration-500 hover:shadow-xl hover:scale-[1.02] opacity-0 animate-fadeIn"
      style={{ animationDelay }}
    >
      <audio 
        ref={audioRef} 
        src={song.preview_url || ''} 
        onEnded={() => setIsPlaying(false)}
      />
      
      <div className="flex flex-col md:flex-row">
        <div className="relative md:w-40 h-40 overflow-hidden">
          <img 
            src={song.album?.images?.[0]?.url || 'https://via.placeholder.com/160'} 
            alt={`${song.name} album cover`}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button 
              onClick={togglePlay}
              className="p-3 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors transform hover:scale-105 active:scale-95"
              aria-label={isPlaying ? 'Pause song' : 'Play song'}
            >
              {isPlaying ? <Pause className="text-purple-600 w-6 h-6" /> : <Play className="text-purple-600 w-6 h-6" />}
            </button>
          </div>
        </div>
        
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 truncate">{song.name}</h3>
            <p className="text-gray-600 truncate">{song.artists?.map(artist => artist.name).join(', ')}</p>
            <p className="text-sm text-gray-500 mt-1">{song.album?.name}</p>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
                <span className="text-xs font-medium text-purple-800">{song.popularity}</span>
              </div>
              <span className="ml-2 text-xs text-gray-500">Popularity</span>
            </div>
            
            <button 
              onClick={toggleFavorite}
              className={`p-2 rounded-full transition-colors ${isFavorited ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'}`}
              aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongCard;