import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import useSound from 'use-sound';

interface MetronomeControlProps {
  bpm: number;
}

const MetronomeControl: React.FC<MetronomeControlProps> = ({ bpm }) => {
  const [isActive, setIsActive] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [play] = useSound('/metronome-tick.mp3', { volume });
  
  const tick = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    play();
  }, [play]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(tick, 60000 / bpm);
    return () => {
      clearInterval(interval);
      if ('vibrate' in navigator) {
        navigator.vibrate(0); // Stop vibration
      }
    };
  }, [isActive, bpm, tick]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Metronome</h3>
        <button
          onClick={() => setIsActive(!isActive)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            isActive 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {isActive ? 'Stop' : 'Start'}
        </button>
      </div>

      <div className="flex items-center space-x-4">
        {volume === 0 ? (
          <VolumeX className="w-5 h-5 text-gray-500" />
        ) : (
          <Volume2 className="w-5 h-5 text-purple-600" />
        )}
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <span className="text-sm text-gray-600 w-12">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  );
};

export default MetronomeControl;