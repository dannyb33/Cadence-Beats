import React, { useState } from "react";
import { 
  Play, Pause, SkipBack, SkipForward, Volume1, Volume2, VolumeX 
} from "lucide-react";
import { useSpotify } from "../context/SpotifyContext";

interface PlayerControlsProps {
  className?: string;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({ className = "" }) => {
  const { isPlaying, controls, playerState } = useSpotify();
  const [volume, setVolume] = useState(50);
  const [prevVolume, setPrevVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);

  const handlePlayPause = async () => {
    if (isPlaying) {
      await controls.pause();
    } else {
      await controls.play();
    }
  };

  const handleNextTrack = async () => {
    await controls.nextTrack();
  };

  const handlePrevTrack = async () => {
    await controls.previousTrack();
  };

  const handleVolumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    await controls.setVolume(newVolume / 100);
  };

  const toggleMute = async () => {
    if (isMuted) {
      setVolume(prevVolume);
      setIsMuted(false);
      await controls.setVolume(prevVolume / 100);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
      await controls.setVolume(0);
    }
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={20} />;
    if (volume < 50) return <Volume1 size={20} />;
    return <Volume2 size={20} />;
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center space-x-4">
        <button 
          onClick={handlePrevTrack}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Previous track"
        >
          <SkipBack size={24} />
        </button>
        
        <button 
          onClick={handlePlayPause}
          className="bg-white rounded-full p-2 text-black hover:scale-105 transition-transform"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} fill="black" />}
        </button>
        
        <button 
          onClick={handleNextTrack}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Next track"
        >
          <SkipForward size={24} />
        </button>
      </div>
      
      <div className="flex items-center ml-8 space-x-2">
        <button 
          onClick={toggleMute}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {getVolumeIcon()}
        </button>
        
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="w-24 accent-green-500"
          aria-label="Volume control"
        />
      </div>
    </div>
  );
};

export default PlayerControls;