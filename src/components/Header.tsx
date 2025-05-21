import React from 'react';
import { Music } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white">
            <Music className="w-6 h-6" />
          </div>
          <h1 className="ml-3 text-2xl font-bold text-gray-800">Tempo Match</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors">Home</a>
          <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors">Favorites</a>
          <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors">About</a>
        </nav>
        
        <div className="hidden md:block">
          <a
            href="https://github.com/yourusername/tempo-match"
            target="_blank"
            rel="noreferrer"
            className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;