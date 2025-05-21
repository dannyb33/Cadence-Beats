import React from "react";
import { useSpotify } from "../context/SpotifyContext";
import { Clock } from "lucide-react";

const RecentlyPlayed: React.FC = () => {
  const { recentTracks, deviceId } = useSpotify();
  
  // Play a track
  const playTrack = async (uri: string) => {
    if (!deviceId) return;
    
    try {
      // We'll call our controls through the context, but we need to add this for future implementation
      console.log("Playing track:", uri);
    } catch (error) {
      console.error("Error playing track:", error);
    }
  };
  
  if (recentTracks.length === 0) {
    return (
      <div className="mt-8">
        <div className="flex items-center text-white mb-4">
          <Clock size={18} className="mr-2" />
          <h2 className="text-xl font-bold">Recently Played</h2>
        </div>
        <p className="text-gray-400">No recently played tracks</p>
      </div>
    );
  }
  
  return (
    <div className="mt-8">
      <div className="flex items-center text-white mb-4">
        <Clock size={18} className="mr-2" />
        <h2 className="text-xl font-bold">Recently Played</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recentTracks.map((track) => (
          <div
            key={track.id + Math.random()} // Add random to handle duplicates
            className="bg-gray-800 bg-opacity-60 backdrop-blur rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
            onClick={() => playTrack(track.uri)}
          >
            <div className="flex items-center space-x-3">
              <img
                src={track.album.images[0]?.url}
                alt={track.album.name}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="overflow-hidden">
                <h3 className="text-white font-medium truncate">{track.name}</h3>
                <p className="text-gray-400 text-sm truncate">
                  {track.artists.map((artist) => artist.name).join(", ")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyPlayed;