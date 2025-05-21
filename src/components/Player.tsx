import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSpotify } from "../context/SpotifyContext";
import PlayerControls from "./PlayerControls";
import TrackInfo from "./TrackInfo";
import ProgressBar from "./ProgressBar";
import RecentlyPlayed from "./RecentlyPlayed";
import { LogOut, Music } from "lucide-react";

const Player: React.FC = () => {
  const { 
    isAuthenticated, 
    logout, 
    isPlayerReady, 
    currentTrack,
    deviceId
  } = useSpotify();
  
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // When deviceId changes and we got it, we should transfer playback
  useEffect(() => {
    if (deviceId) {
      // This is where we would transfer playback to this device
      console.log("Device ready:", deviceId);
    }
  }, [deviceId]);
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center">
            <div className="bg-green-500 p-2 rounded-full mr-3">
              <Music size={24} className="text-black" />
            </div>
            <h1 className="text-2xl font-bold">Spotify Web Player</h1>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <LogOut size={20} className="mr-2" />
            <span>Logout</span>
          </button>
        </header>
        
        {/* Main content */}
        <main>
          {/* Player section */}
          <div className="bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <TrackInfo track={currentTrack} className="flex-1" />
              
              <div className="flex-1 flex flex-col items-center">
                <PlayerControls className="mb-4" />
                <ProgressBar className="w-full max-w-md" />
              </div>
            </div>
          </div>
          
          {/* Status message */}
          {!isPlayerReady && (
            <div className="mt-6 p-4 bg-yellow-500 bg-opacity-20 text-yellow-300 rounded-lg">
              <p className="font-medium">
                Initializing Spotify Player... Please make sure Spotify is open on another device.
              </p>
            </div>
          )}
          
          {/* Recently played tracks */}
          <RecentlyPlayed />
        </main>
      </div>
    </div>
  );
};

export default Player;