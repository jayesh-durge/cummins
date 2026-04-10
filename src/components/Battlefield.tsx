import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSound } from '../context/SoundContext';
import './Battlefield.css';

type SeatStatus = 'available' | 'booked' | 'recommended' | 'selected';

interface Seat {
  id: string;
  row: number;
  col: number;
  status: SeatStatus;
}

const ROWS = 8;
const COLS = 12;

const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let status: SeatStatus = 'available';
      // Randomly assign some booked and recommended seats
      const rand = Math.random();
      if (rand < 0.2) status = 'booked';
      else if (rand > 0.9) status = 'recommended';
      
      seats.push({
        id: `${r}-${c}`,
        row: r,
        col: c,
        status,
      });
    }
  }
  return seats;
};

interface BattlefieldProps {
  onConfirm: (seats: string[]) => void;
}

const Battlefield = ({ onConfirm }: BattlefieldProps) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const { playHover, playClick } = useSound();

  useEffect(() => {
    setSeats(generateSeats());
  }, []);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked') return;
    
    playClick();
    setSeats((prev) => 
      prev.map((s) => {
        if (s.id === seat.id) {
          if (s.status === 'selected') {
            return { ...s, status: s.row < 2 ? 'recommended' : 'available' }; // Just random toggle back behavior
          }
          return { ...s, status: 'selected' };
        }
        return s;
      })
    );
  };

  const handleConfirm = () => {
    playClick();
    const selected = seats.filter(s => s.status === 'selected').map(s => `Sect-${String.fromCharCode(65 + s.row)}${s.col + 1}`);
    onConfirm(selected);
  };

  return (
    <section id="battlefield" className="battlefield-section">
      <div className="container">
        <div className="battlefield-header">
          <motion.h2 
            className="text-gradient"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Tactical Map
          </motion.h2>
          <p className="text-muted">Select your territory to conquer.</p>
        </div>

        <div className="battlefield-arena">
          <div className="arena-stage">
            <div className="stage-screen">STAGE</div>
          </div>
          
          <div className="seat-grid">
            {seats.map((seat) => (
              <motion.button
                key={seat.id}
                className={`seat ${seat.status}`}
                disabled={seat.status === 'booked'}
                onClick={() => handleSeatClick(seat)}
                onMouseEnter={() => {
                  if (seat.status !== 'booked') playHover();
                }}
                whileHover={seat.status !== 'booked' ? { scale: 1.2, zIndex: 10 } : {}}
                whileTap={seat.status !== 'booked' ? { scale: 0.9 } : {}}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.3,
                  delay: (seat.row * 0.05) + (seat.col * 0.02)
                }}
              >
                <div className="seat-inner"></div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="battlefield-legend">
          <div className="legend-item">
            <div className="seat-sample available"></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="seat-sample recommended"></div>
            <span>Strategic (Recommended)</span>
          </div>
          <div className="legend-item">
            <div className="seat-sample selected"></div>
            <span>Conquered (Selected)</span>
          </div>
          <div className="legend-item">
            <div className="seat-sample booked"></div>
            <span>Occupied</span>
          </div>
        </div>

        <div className="battlefield-actions text-center">
          <button 
            className="btn-primary"
            onClick={handleConfirm}
            onMouseEnter={playHover}
            disabled={!seats.some(s => s.status === 'selected')}
          >
            Claim Territory
          </button>
        </div>
      </div>
    </section>
  );
};

export default Battlefield;
