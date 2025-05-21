import React from "react";
import { SpotifyTrack } from "../types/spotify";

interface TrackInfoProps {
  track: SpotifyTrack | null;
  className?: string;
}

const TrackInfo: React.FC<TrackInfoProps> = ({ track, className = "" }) => {
  if (!track) {
    return (
      <div className={`flex items-center space-x-4 ${className}`}>
        <div className="w-14 h-14 bg-gray-700 rounded animate-pulse" />
        <div className="flex-1">
          <div className="h-5 bg-gray-700 rounded w-40 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-700 rounded w-32 animate-pulse" />
        </div>
      </div>
    );
  }

  const { name, artists, album } = track;
  const albumCover = album.images[0]?.url;
  const artistNames = artists.map((artist) => artist.name).join(", ");

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {albumCover ? (
        <img 
          src={albumCover} 
          alt={`${album.name} cover`} 
          className="w-14 h-14 rounded shadow-lg object-cover"
        />
      ) : (
        <div className="w-14 h-14 bg-gray-700 rounded flex items-center justify-center text-gray-500">
          No Cover
        </div>
      )}
      
      <div className="flex-1 overflow-hidden">
        <h3 className="text-white font-medium truncate">{name}</h3>
        <p className="text-gray-400 text-sm truncate">{artistNames}</p>
      </div>
    </div>
  );
};

export default TrackInfo;