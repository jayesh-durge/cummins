import { useState } from 'react';
import Hero from './components/Hero';
import AudioPlayer from './components/AudioPlayer';
import Movies from './components/Movies';
import Events from './components/Events';
import Battlefield from './components/Battlefield';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import BookingStatus from './components/BookingStatus';
import { useSound } from './context/SoundContext';
import { ArrowLeft } from 'lucide-react';
import './App.css';

function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [activeBattlefront, setActiveBattlefront] = useState<string | null>(null);
  const [reservation, setReservation] = useState<{ event: string, seats: string[] } | null>(null);
  const [activeView, setActiveView] = useState<'home' | 'status'>('home');
  const { startBgm, playEntry, playHover, playVictory } = useSound();

  const handleEnter = () => {
    setHasEntered(true);
    startBgm();
    playEntry();
  };

  const handleNavigate = (dest: string) => {
    setActiveBattlefront(null); // Force close battlefield

    if (dest === 'status') {
      setActiveView('status');
      window.scrollTo(0, 0);
    } else {
      setActiveView('home');
      setTimeout(() => {
        if (dest === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
        else if (dest === 'movies') document.getElementById('movies')?.scrollIntoView({ behavior: 'smooth' });
        else if (dest === 'events') document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleConfirmReservation = (seats: string[]) => {
    if (activeBattlefront) {
      setReservation({ event: activeBattlefront, seats });
      setActiveBattlefront(null);
      setActiveView('status');
      window.scrollTo(0, 0);
      playVictory(); 
    }
  };

  // Determine what string the Navbar should highlight
  const currentNavView = activeView === 'status' ? 'status' : activeBattlefront ? 'events' : 'home';

  return (
    <div className="app-container">
      <CustomCursor />
      <AudioPlayer isPlaying={hasEntered} />
      
      {hasEntered && <Navbar onNavigate={handleNavigate} activeView={currentNavView} />}
      
      {!hasEntered ? (
        <div className="entry-screen">
          <div className="entry-content">
            <h1 className="title text-gradient">Dhurandhar</h1>
            <p className="subtitle">The Battlefield Awaits</p>
            <button 
              className="btn-primary entry-btn"
              onClick={handleEnter}
              onMouseEnter={playHover}
            >
              Enter the Arena
            </button>
          </div>
        </div>
      ) : activeView === 'status' ? (
        <main className="main-content">
          <BookingStatus 
            reservation={reservation} 
            onReturn={() => handleNavigate('home')} 
          />
        </main>
      ) : activeBattlefront ? (
        <main className="main-content" style={{ paddingTop: '70px' }}>
          <div className="container" style={{ padding: '40px 20px 0', position: 'relative', zIndex: 10 }}>
            <button 
              className="btn-ghost" 
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', fontSize: '1rem' }}
              onClick={() => setActiveBattlefront(null)}
            >
              <ArrowLeft size={18} /> Retreat to Selection
            </button>
          </div>
          <Battlefield onConfirm={handleConfirmReservation} />
        </main>
      ) : (
        <main className="main-content">
          <Hero />
          <Movies onSelect={(title) => setActiveBattlefront(title)} />
          <Events onSelect={(title) => setActiveBattlefront(title)} />
        </main>
      )}
    </div>
  );
}

export default App;
