import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Cpu, CheckCircle2, Ticket } from 'lucide-react';
import './BookingStatus.css';

interface BookingStatusProps {
  reservation: { event: string; seats: string[] } | null;
  onReturn: () => void;
}

const BookingStatus = ({ reservation, onReturn }: BookingStatusProps) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Cyberpunk hacking/booking sequence
    if (reservation) {
      const timer1 = setTimeout(() => setStep(1), 1500); // Bypassing Mainframe
      const timer2 = setTimeout(() => setStep(2), 3500); // Securing Territory
      const timer3 = setTimeout(() => setStep(3), 5000); // Print Ticket

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [reservation]);

  if (!reservation) {
    return (
      <div className="status-container empty">
        <h2 className="text-gradient">No Active Conquests</h2>
        <p className="text-muted">Return to the War Room to select a campaign.</p>
        <button className="btn-primary mt-4" onClick={onReturn}>Return to HQ</button>
      </div>
    );
  }

  return (
    <div className="status-container">
      <motion.div 
        className="booking-terminal"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="terminal-header">
          <div className="terminal-dot red"></div>
          <div className="terminal-dot yellow"></div>
          <div className="terminal-dot green"></div>
          <span className="terminal-title">SYS.CONQUEST_PROTOCOL_V2</span>
        </div>

        <div className="terminal-body">
          <h2 className="target-title text-gradient">Target: {reservation.event}</h2>
          
          <div className="stepper">
            <div className={`step ${step >= 0 ? 'active' : ''} ${step > 0 ? 'completed' : ''}`}>
              <ShieldAlert className="step-icon" />
              <div className="step-content">
                <h4>Uplink Initiated</h4>
                <p>{step > 0 ? 'Connection established.' : 'Establishing secure connection...'}</p>
              </div>
            </div>

            <div className={`step-connector ${step > 0 ? 'active' : ''}`}></div>

            <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <Cpu className="step-icon" />
              <div className="step-content">
                <h4>Securing Territory</h4>
                <p>{step > 1 ? 'Sectors locked down.' : step === 1 ? 'Overriding grid defenses...' : 'Awaiting sync...'}</p>
              </div>
            </div>

            <div className={`step-connector ${step > 1 ? 'active' : ''}`}></div>

            <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <CheckCircle2 className="step-icon" />
              <div className="step-content">
                <h4>Conquest Successful</h4>
                <p>{step >= 2 ? 'Territory claimed.' : 'Pending protocol completion...'}</p>
              </div>
            </div>
          </div>

          <AnimateTicket show={step >= 3} reservation={reservation} onReturn={onReturn} />
        </div>
      </motion.div>
    </div>
  );
};

const AnimateTicket = ({ show, reservation, onReturn }: { show: boolean, reservation: any, onReturn: () => void }) => {
  if (!show) return null;

  return (
    <motion.div 
      className="ticket-receipt"
      initial={{ opacity: 0, y: 50, rotateX: 90 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ type: 'spring', damping: 15, duration: 0.8 }}
    >
      <div className="ticket-header">
        <Ticket size={24} />
        <h3>OFFICIAL DECREE</h3>
      </div>
      <div className="ticket-details">
        <div className="detail-row">
          <span className="label">Campaign:</span>
          <span className="value">{reservation.event}</span>
        </div>
        <div className="detail-row">
          <span className="label">Sectors:</span>
          <span className="value ticket-seats">
            {reservation.seats.map((s: string) => <span key={s} className="seat-badge">{s}</span>)}
          </span>
        </div>
        <div className="detail-row">
          <span className="label">Authorization:</span>
          <span className="value authorized text-gradient">GRANTED</span>
        </div>
      </div>
      
      <button className="btn-primary w-100 mt-4" onClick={onReturn}>Return to HQ</button>
    </motion.div>
  );
}

export default BookingStatus;
