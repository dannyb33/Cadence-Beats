import React, { createContext, useContext, useState, useEffect } from 'react';

interface CadenceContextType {
  targetBpm: number;
  currentBpm: number;
  setTargetBpm: (bpm: number) => void;
  setCurrentBpm: (bpm: number) => void;
  suggestedAdjustment: 'up' | 'down' | null;
}

const CadenceContext = createContext<CadenceContextType | undefined>(undefined);

export function CadenceProvider({ children }: { children: React.ReactNode }) {
  const [targetBpm, setTargetBpm] = useState<number>(120);
  const [currentBpm, setCurrentBpm] = useState<number>(120);
  const [outOfRangeStartTime, setOutOfRangeStartTime] = useState<number | null>(null);
  const [suggestedAdjustment, setSuggestedAdjustment] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    const bpmDiff = currentBpm - targetBpm;
    const now = Date.now();

    if (Math.abs(bpmDiff) > 5) {
      if (!outOfRangeStartTime) {
        setOutOfRangeStartTime(now);
      } else if (now - outOfRangeStartTime > 10000) { // 10 seconds
        setSuggestedAdjustment(bpmDiff > 0 ? 'up' : 'down');
        
        // Trigger haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate([100, 100, 100]);
        }

        // Text-to-speech notification
        const msg = new SpeechSynthesisUtterance(
          `Adjusting tempo ${bpmDiff > 0 ? 'up' : 'down'} to match your cadence`
        );
        window.speechSynthesis.speak(msg);
      }
    } else {
      setOutOfRangeStartTime(null);
      setSuggestedAdjustment(null);
    }
  }, [currentBpm, targetBpm, outOfRangeStartTime]);

  return (
    <CadenceContext.Provider 
      value={{ 
        targetBpm, 
        currentBpm, 
        setTargetBpm, 
        setCurrentBpm,
        suggestedAdjustment 
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