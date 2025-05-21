import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SongList from '../components/SongList';
import { Song } from '../types';
import { fetchSongsByBPM } from '../api/songsApi';
import { ArrowLeft, Music2, ListMusic } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

const RecommendationsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentBpm, setCurrentBpm] = useState<number>(120);
  const { queue, addToQueue, removeFromQueue } = useQueue();

  useEffect(() => {
    const bpm = Number(searchParams.get('bpm')) || 120;
    setCurrentBpm(bpm);
    loadSongs(bpm);
  }, [searchParams]);

  const loadSongs = async (bpm: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await fetchSongsByBPM(bpm, 25);
      setSongs(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setSongs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBpmChange = (newBpm: number) => {
    setCurrentBpm(newBpm);
    navigate(`/recommendations?bpm=${newBpm}`);
  };

  const handleRefresh = () => {
    loadSongs(currentBpm);
  };

  const handleBackToHome = () => {
    navigate(`/?bpm=${currentBpm}`);
  };

  return (
    <main className="mt-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBackToHome}
            className="flex items-center px-4 py-2 text-gray-700 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to BPM Input
          </button>
          
          <div className="flex items-center bg-white px-6 py-3 rounded-lg shadow-sm">
            <Music2 className="w-5 h-5 text-purple-600 mr-3" />
            <span className="text-lg font-semibold text-gray-800">Current BPM: </span>
            <span className="text-2xl font-bold text-purple-600 ml-2">{currentBpm}</span>
          </div>
        </div>

        {queue.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center mb-4">
              <ListMusic className="w-5 h-5 text-purple-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Queue ({queue.length})</h2>
            </div>
            <div className="space-y-3">
              {queue.map((song, index) => (
                <div 
                  key={`${song.id}-${index}`}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                >
                  <div className="flex items-center">
                    <img 
                      src={song.album?.images[0]?.url} 
                      alt={song.name}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <div className="ml-3">
                      <p className="font-medium text-gray-800">{song.name}</p>
                      <p className="text-sm text-gray-500">{song.artists.map(a => a.name).join(', ')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromQueue(song.id)}
                    className="text-red-500 hover:text-red-600 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <SongList
          songs={songs}
          isLoading={isLoading}
          error={error}
          onBpmChange={handleBpmChange}
          currentBpm={currentBpm}
          onRefresh={handleRefresh}
          onAddToQueue={addToQueue}
        />
      </div>
    </main>
  );
};

export default RecommendationsPage;