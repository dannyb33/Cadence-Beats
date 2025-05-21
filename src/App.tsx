import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import RecommendationsPage from './pages/RecommendationsPage';
import { QueueProvider } from './context/QueueContext';

function App() {
  return (
    <QueueProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
            <Header />
            
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />
            </Routes>
            
            <footer className="mt-20 py-8 text-center text-gray-500 text-sm">
              <p>© {new Date().getFullYear()} Tempo Match. All rights reserved.</p>
              <p className="mt-2">Powered by Spotify API</p>
            </footer>
          </div>
        </div>
      </Router>
    </QueueProvider>
  );
}

export default App