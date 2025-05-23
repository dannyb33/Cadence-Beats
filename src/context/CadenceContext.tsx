import React, { createContext, useContext, useState } from 'react';

interface CadenceContextType {
  targetBpm: number;
  currentBpm: number;
  setTargetBpm: (bpm: number) => void;
  setCurrentBpm: (bpm: number) => void;
}

const CadenceContext = createContext<CadenceContextType | undefined>(undefined);

export function CadenceProvider({ children }: { children: React.ReactNode }) {
  const [targetBpm, setTargetBpm] = useState<number>(120);
  const [currentBpm, setCurrentBpm] = useState<number>(120);

  return (
    <CadenceContext.Provider 
      value={{ 
        targetBpm, 
        currentBpm, 
        setTargetBpm, 
        setCurrentBpm
      }}
    >
      {children}
    </CadenceContext.Provider>
  );
}

export function useCadence() {
  const context = useContext(CadenceContext);
  if (context === undefined) {
    throw new Error('useCadence must be used within a CadenceProvider');
  }
  return context;
}