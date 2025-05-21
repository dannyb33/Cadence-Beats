import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BPMInput from '../components/BPMInput';
import { useQueue } from '../context/QueueContext';
import { ListMusic } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { queue } = useQueue();

  // Get the current BPM from the URL if coming from recommendations
  const currentBpm = new URLSearchParams(location.search).get('bpm');

  const handleBPMSubmit = (bpm: number) => {
    setIsLoading(true);
    navigate(`/recommendations?bpm=${bpm}`);
  };

  return (
    <main className="mt-8 flex flex-col items-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Find Your Perfect Beat</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Enter a BPM (beats per minute) to discover songs that match your desired tempo.
          Perfect for workouts, dancing, or creative projects.
        </p>
      </div>

      {queue.length > 0 && (
        <div className="w-full max-w-md mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <ListMusic className="w-5 h-5 text-purple-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Current Queue ({queue.length})</h2>
          </div>
          <div className="space-y-2">
            {queue.map((song, index) => (
              <div key={`${song.id}-${index}`} className="text-gray-700">
                {song.name} - {song.artists.map(a => a.name).join(', ')}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <BPMInput 
        onSubmit={handleBPMSubmit} 
        isLoading={isLoading} 
        currentBpm={currentBpm ? parseInt(currentBpm, 10) : undefined}
      />
    </main>
  );
};

export default HomePage;