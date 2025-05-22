import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import RecommendationsPage from './pages/RecommendationsPage';
import FavoritesPage from './pages/FavoritesPage';
import HistoryPage from './pages/HistoryPage';
import MetronomePage from './pages/MetronomePage';
import { QueueProvider } from './context/QueueContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { RunHistoryProvider } from './context/RunHistoryContext';
import { CadenceProvider } from './context/CadenceContext';

function App() {
  return (
    <RunHistoryProvider>
      <FavoritesProvider>
        <QueueProvider>
          <CadenceProvider>
            <Router>
              <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
                <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
                  <Header />
                  
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/recommendations" element={<RecommendationsPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/metronome" element={<MetronomePage />} />
                  </Routes>
                  
                  <footer className="mt-20 py-8 text-center text-gray-500 text-sm">
                    <p>© {new Date().getFullYear()} Cadence Beats. All rights reserved.</p>
                    <p className="mt-2">Powered by Spotify API</p>
                  </footer>
                </div>
              </div>
            </Router>
          </CadenceProvider>
        </QueueProvider>
      </FavoritesProvider>
    </RunHistoryProvider>
  );
}

export default App;