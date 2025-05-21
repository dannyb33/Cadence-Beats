import React, { useState, useEffect } from "react";
import { useSpotify } from "../context/SpotifyContext";

interface ProgressBarProps {
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ className = "" }) => {
  const { playerState, controls } = useSpotify();
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  
  const duration = playerState?.duration || 0;
  
  useEffect(() => {
    if (!playerState || isDragging) return;
    
    setProgress(playerState.position);
    
    const interval = setInterval(() => {
      if (playerState.paused) return;
      
      setProgress((prev) => {
        const newProgress = prev + 1000;
        return newProgress > duration ? duration : newProgress;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [playerState, isDragging, duration]);
  
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setDragProgress(value);
  };
  
  const handleProgressStart = () => {
    setIsDragging(true);
    setDragProgress(progress);
  };
  
  const handleProgressEnd = async () => {
    setIsDragging(false);
    setProgress(dragProgress);
    await controls.seek(dragProgress);
  };
  
  const formatTime = (ms: number) => {
    if (!ms) return "0:00";
    
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  
  return (
    <div className={`w-full flex flex-col ${className}`}>
      <div className="relative w-full">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={isDragging ? dragProgress : progress}
          onChange={handleProgressChange}
          onMouseDown={handleProgressStart}
          onMouseUp={handleProgressEnd}
          onTouchStart={handleProgressStart}
          onTouchEnd={handleProgressEnd}
          className="w-full h-2 accent-green-500 bg-gray-700 rounded-full appearance-none cursor-pointer"
          aria-label="Track progress"
        />
      </div>
      
      <div className="flex justify-between mt-1 text-xs text-gray-400">
        <span>{formatTime(isDragging ? dragProgress : progress)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;