import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SongList from '../components/SongList';
import MetronomeControl from '../components/MetronomeControl';
import { Song } from '../types';
import { fetchSongsByBPM, searchSong } from '../api/songsApi';
import { ArrowLeft, Music2, ListMusic, Trash2, Search } from 'lucide-react';
import { useQueue } from '../context/QueueContext';
import { useCadence } from '../context/CadenceContext';

const RecommendationsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentBpm, setCurrentBpm] = useState<number>(120);
  const [searchQuery, setSearchQuery] = useState('');
  const { queue, addToQueue, removeFromQueue, clearQueue } = useQueue();
  const { setTargetBpm } = useCadence();

  const currStartIndex = React.useRef<number>(0);
  const currSongs = React.useRef<Song[]>([]);

  useEffect(() => {
    const bpm = Number(searchParams.get('bpm')) || 120;
    setCurrentBpm(bpm);
    setTargetBpm(bpm);
    loadSongs(bpm);
  }, [searchParams, setTargetBpm]);

  const loadSongs = async (bpm: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedSongs = await fetchSongsByBPM(bpm, 25);
      currSongs.current = fetchedSongs;
      currStartIndex.current = 0;
      setSongSlice(fetchedSongs, currStartIndex.current);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setSongs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const song = await searchSong(searchQuery);
      if (!song) {
        setError('No songs found');
        setSongs([]);
      } else {
        setSongs([song]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search for song');
      setSongs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBpmChange = (newBpm: number) => {
    setCurrentBpm(newBpm);
    setTargetBpm(newBpm);
    navigate(`/recommendations?bpm=${newBpm}`);
  };

  const handleRefresh = () => {
    if(currStartIndex.current + 5 < currSongs.current.length) {
      currStartIndex.current += 5;
    } else {
      currStartIndex.current = 0;
    }
    setSongSlice(currSongs.current, currStartIndex.current);
  };

  const handleBackToHome = () => {
    currStartIndex.current = 0;
    navigate(`/?bpm=${currentBpm}`);
  };

  const setSongSlice = async (songs: Song[], startIndex: number) => {
    setSongs(songs.slice(startIndex, startIndex + 5));
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
            <Music2 className="w-5 h-5 text-orange-500 mr-3" />
            <span className="text-lg font-semibold text-gray-800">Current BPM: </span>
            <span className="text-2xl font-bold text-orange-500 ml-2">{currentBpm}</span>
          </div>
        </div>

        <div className="mb-8">
          <MetronomeControl bpm={currentBpm} />
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a song..."
              className="w-full px-4 py-3 pl-12 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {queue.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <ListMusic className="w-5 h-5 text-orange-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Queue ({queue.length})</h2>
              </div>
              <button
                onClick={clearQueue}
                className="flex items-center px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Queue
              </button>
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
                    onClick={() => removeFromQueue(song.id, index)}
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