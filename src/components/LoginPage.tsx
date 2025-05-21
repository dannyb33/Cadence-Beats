import React from "react";
import { getAuthorizationUrl } from "../utils/auth";
import { Music } from "lucide-react";

const LoginPage: React.FC = () => {
  const handleLogin = () => {
    window.location.href = getAuthorizationUrl();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 bg-opacity-70 backdrop-blur rounded-xl p-8 shadow-2xl text-center">
        <div className="mb-8 flex justify-center">
          <div className="bg-green-500 p-4 rounded-full">
            <Music size={40} className="text-black" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2">Spotify Web Player</h1>
        <p className="text-gray-300 mb-8">
          Experience your music with our beautifully designed web player.
        </p>
        
        <button
          onClick={handleLogin}
          className="bg-green-500 hover:bg-green-400 text-black font-bold py-3 px-6 rounded-full w-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
        >
          <span>Connect with Spotify</span>
        </button>
        
        <p className="mt-6 text-xs text-gray-400">
          You'll be redirected to Spotify to authorize this application.
        </p>
      </div>
      
      <div className="mt-12 text-gray-500 text-sm">
        <p>Powered by Spotify Web Playback SDK</p>
      </div>
    </div>
  );
};

export default LoginPage;