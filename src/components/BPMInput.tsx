import React, { useState, useEffect } from 'react';
import { Minus, Plus, Volume2 } from 'lucide-react';

interface BPMInputProps {
  onSubmit: (bpm: number) => void;
  isLoading: boolean;
  currentBpm?: number;
}

const BPMInput: React.FC<BPMInputProps> = ({ onSubmit, isLoading, currentBpm }) => {
  const [bpm, setBpm] = useState<number>(120);
  
  useEffect(() => {
    if (currentBpm) {
      setBpm(currentBpm);
    }
  }, [currentBpm]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBpm(parseInt(e.target.value, 10));
  };

  const incrementBPM = () => {
    setBpm(prev => Math.min(prev + 1, 200));
  };

  const decrementBPM = () => {
    setBpm(prev => Math.max(prev - 1, 60));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(bpm);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white bg-opacity-90 backdrop-blur-lg rounded-xl shadow-lg p-8 mb-10">
      <div className="flex items-center justify-center space-x-2 mb-6">
        <Volume2 className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-semibold text-gray-800">Find songs by BPM</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <label htmlFor="bpm" className="block text-sm font-medium text-gray-600 mb-2">
              Beats Per Minute (BPM)
            </label>
            <div className="text-sm text-gray-500">60-200 BPM</div>
          </div>
          
          <div className="flex items-center mb-4">
            <button 
              type="button" 
              onClick={decrementBPM}
              className="p-2 rounded-full border border-gray-300 hover:bg-purple-50 transition-colors"
              aria-label="Decrease BPM"
            >
              <Minus size={16} className="text-purple-600" />
            </button>
            
            <div className="flex-1 mx-4">
              <input
                type="range"
                id="bpm-slider"
                min={60}
                max={200}
                value={bpm}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>
            
            <button 
              type="button" 
              onClick={incrementBPM}
              className="p-2 rounded-full border border-gray-300 hover:bg-purple-50 transition-colors"
              aria-label="Increase BPM"
            >
              <Plus size={16} className="text-purple-600" />
            </button>
          </div>
          
          <div className="flex items-center justify-center">
            <input
              type="number"
              id="bpm"
              min={60}
              max={200}
              value={bpm}
              onChange={(e) => setBpm(parseInt(e.target.value, 10) || 120)}
              className="w-20 text-center text-3xl font-bold text-gray-800 bg-transparent border-b-2 border-purple-600 focus:outline-none focus:border-purple-700"
            />
            <span className="ml-2 text-gray-500 text-lg">BPM</span>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-lg shadow-md hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </span>
          ) : (
            'Find Songs'
          )}
        </button>
      </form>
    </div>
  );
};

export default BPMInput;