import React, { createContext, useContext, useState } from 'react';
import { Song } from '../types';

interface QueueContextType {
  queue: Song[];
  addToQueue: (song: Song) => void;
  removeFromQueue: (songId: string) => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export function QueueProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<Song[]>([]);

  const addToQueue = (song: Song) => {
    setQueue(prevQueue => [...prevQueue, song]);
  };

  const removeFromQueue = (songId: string) => {
    setQueue(prevQueue => prevQueue.filter(song => song.id !== songId));
  };

  return (
    <QueueContext.Provider value={{ queue, addToQueue, removeFromQueue }}>
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue() {
  const context = useContext(QueueContext);
  if (context === undefined) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
}