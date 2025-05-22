import React, { useState, useCallback, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import useSound from 'use-sound';

const MetronomePage: React.FC = () => {
  const [bpm, setBpm] = useState<number>(120);
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
        navigator.vibrate(0);
      }
    };
  }, [isActive, bpm, tick]);

  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 30 && value <= 300) {
      setBpm(value);
    }
  };

  const adjustBpm = (adjustment: number) => {
    setBpm(prev => Math.min(Math.max(prev + adjustment, 30), 300));
  };

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Metronome</h2>
        
        <div className="space-y-8">
          <div>
            <label htmlFor="bpm" className="block text-sm font-medium text-gray-600 mb-2">
              Beats Per Minute (BPM)
            </label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => adjustBpm(-1)}
                className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                -
              </button>
              <input
                type="number"
                id="bpm"
                value={bpm}
                onChange={handleBpmChange}
                className="w-24 text-center text-2xl font-bold text-gray-800 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500"
                min="30"
                max="300"
              />
              <button
                onClick={() => adjustBpm(1)}
                className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Volume
            </label>
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

          <div className="flex justify-center">
            <button
              onClick={() => setIsActive(!isActive)}
              className={`px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 ${
                isActive
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600'
              }`}
            >
              {isActive ? 'Stop' : 'Start'}
            </button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Range: 30-300 BPM</p>
            <p className="mt-1">Use arrow keys or buttons to adjust BPM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetronomePage;