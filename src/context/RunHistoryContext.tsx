import React, { createContext, useContext, useState, useEffect } from 'react';
import { Run } from '../types';

interface RunHistoryContextType {
  runs: Run[];
  addRun: (run: Omit<Run, 'id'>) => void;
  clearHistory: () => void;
}

const RunHistoryContext = createContext<RunHistoryContextType | undefined>(undefined);

export function RunHistoryProvider({ children }: { children: React.ReactNode }) {
  const [runs, setRuns] = useState<Run[]>(() => {
    const saved = localStorage.getItem('runHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('runHistory', JSON.stringify(runs));
  }, [runs]);

  const addRun = (newRun: Omit<Run, 'id'>) => {
    const run: Run = {
      ...newRun,
      id: crypto.randomUUID(),
    };
    setRuns(prev => [...prev, run]);
  };

  const clearHistory = () => {
    setRuns([]);
  };

  return (
    <RunHistoryContext.Provider value={{ runs, addRun, clearHistory }}>
      {children}
    </RunHistoryContext.Provider>
  );
}

export function useRunHistory() {
  const context = useContext(RunHistoryContext);
  if (context === undefined) {
    throw new Error('useRunHistory must be used within a RunHistoryProvider');
  }
  return context;
}