import React, { createContext, useContext, useState } from 'react';
import { Song } from '../types';

interface QueueContextType {
  queue: Song[];
  addToQueue: (song: Song) => void;
  removeFromQueue: (songId: string, index: number) => void;
  clearQueue: () => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export function QueueProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<Song[]>([]);

  const addToQueue = (song: Song) => {
    setQueue(prevQueue => [...prevQueue, song]);
  };

  const removeFromQueue = (songId: string, index: number) => {
    setQueue(prevQueue => {
      const newQueue = [...prevQueue];
      // Only remove the song at the specific index
      newQueue.splice(index, 1);
      return newQueue;
    });
  };

  const clearQueue = () => {
    setQueue([]);
  };

  return (
    <QueueContext.Provider value={{ queue, addToQueue, removeFromQueue, clearQueue }}>
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