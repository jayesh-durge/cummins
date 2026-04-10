import React, { createContext, useContext, useState, useEffect } from 'react';

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playHover: () => void;
  playClick: () => void;
  playVictory: () => void;
  playEntry: () => void;
  startBgm: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);

  // We keep these functions exposed but make them empty (no-ops)
  // so that we don't have to rewrite or break the components that call them.
  const playHover = () => {};
  const playClick = () => {};
  const playVictory = () => {};
  const playEntry = () => {};
  const startBgm = () => {};

  useEffect(() => {
    // Global generic click sound
    const handleGlobalClick = () => {
      if (!isMuted) {
        const audio = new Audio('/clicksound.mp3');
        audio.volume = 0.8; // Bumped volume up slightly since it's the only sound now
        audio.play().catch(e => console.log('Global click failed:', e));
      }
    };
    
    window.addEventListener('mousedown', handleGlobalClick);
    return () => {
      window.removeEventListener('mousedown', handleGlobalClick);
    };
  }, [isMuted]);

  const toggleMute = () => setIsMuted(prev => !prev);

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, playHover, playClick, playVictory, playEntry, startBgm }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
