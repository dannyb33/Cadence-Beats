import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTokenFromUrl, exchangeCodeForToken, saveToken } from "../utils/auth";
import { Loader } from "lucide-react";

const CallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { code, state } = getTokenFromUrl();
        
        // Verify state
        const storedState = localStorage.getItem("spotify_auth_state");
        
        if (!code) {
          throw new Error("No authorization code found in URL");
        }
        
        if (state !== storedState) {
          throw new Error("State mismatch. Possible CSRF attack");
        }
        
        // Exchange code for token
        const token = await exchangeCodeForToken(code);
        
        // Save token
        saveToken(token);
        
        // Redirect to player
        navigate("/player");
      } catch (err) {
        console.error("Error in callback:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      }
    };
    
    handleCallback();
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center px-4">
      {error ? (
        <div className="max-w-md w-full bg-gray-800 bg-opacity-70 backdrop-blur rounded-xl p-8 shadow-2xl text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Authentication Error</h1>
          <p className="text-red-400 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-white text-black font-bold py-2 px-4 rounded"
          >
            Return to Login
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Loader size={48} className="text-green-500 animate-spin mb-4" />
          <h2 className="text-xl text-white font-medium">Authenticating with Spotify...</h2>
          <p className="text-gray-400 mt-2">Please wait while we complete the process</p>
        </div>
      )}
    </div>
  );
};

export default CallbackPage;