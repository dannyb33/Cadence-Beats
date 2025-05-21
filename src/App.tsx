import React, { useState } from 'react';
import Header from './components/Header';
import BPMInput from './components/BPMInput';
import SongList from './components/SongList';
import { Song } from './types';
import { fetchSongsByBPM } from './api/songsApi';

function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);

  const handleBPMSubmit = async (bpm: number) => {
    setIsLoading(true);
    setError(null);
    setSearchPerformed(true);
    
    try {
      // In a real app, use fetchSongsByBPM instead of mockFetchSongsByBPM
      const results = await fetchSongsByBPM(bpm, 2);
      setSongs(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setSongs([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
        <Header />
        
        <main className="mt-8 flex flex-col items-center">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Find Your Perfect Beat</h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              Enter a BPM (beats per minute) to discover songs that match your desired tempo.
              Perfect for workouts, dancing, or creative projects.
            </p>
          </div>
          
          <BPMInput onSubmit={handleBPMSubmit} isLoading={isLoading} />
          
          {searchPerformed && (
            <div className="w-full mt-8 transition-opacity duration-500 opacity-100">
              <SongList songs={songs} isLoading={isLoading} error={error} />
            </div>
          )}
        </main>
        
        <footer className="mt-20 py-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Tempo Match. All rights reserved.</p>
          <p className="mt-2">Powered by Spotify API</p>
        </footer>
      </div>
    </div>
  );
}

export default App;