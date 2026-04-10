import { motion } from 'framer-motion';
import { Shield, Sparkles, MapPin } from 'lucide-react';
import { useSound } from '../context/SoundContext';
import './Events.css';

const eventsData = [
  {
    id: 1,
    title: "Clash of Titans 2026",
    location: "Mumbai Arena",
    image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=2574&auto=format&fit=crop",
    intensity: "Extreme",
  },
  {
    id: 2,
    title: "Neon Cyber Fight",
    location: "Neo-Delhi Colosseum",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
    intensity: "High",
  },
  {
    id: 3,
    title: "Shadow Tournament",
    location: "Bangalore Underground",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=2547&auto=format&fit=crop",
    intensity: "Legendary",
  }
];

const EventCard = ({ event, index, onSelect }: { event: any, index: number, onSelect: (title: string) => void }) => {
  const { playHover, playClick } = useSound();

  return (
    <motion.div 
      className="event-card-wrapper"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, duration: 0.6 }}
      whileHover={{ y: -10 }}
      onMouseEnter={playHover}
    >
      <div className="event-card" onClick={playClick}>
        <div className="event-image-container">
          <img src={event.image} alt={event.title} className="event-image" />
          <div className="event-overlay"></div>
          <div className="event-badge">
            <Sparkles size={14} />
            <span>{event.intensity}</span>
          </div>
        </div>
        
        <div className="event-content">
          <h3 className="event-title">{event.title}</h3>
          <div className="event-detail">
            <MapPin size={16} className="text-muted" />
            <span className="text-muted">{event.location}</span>
          </div>
          
          <button 
            className="btn-conquer mt-4"
            onMouseEnter={(e) => {
              e.stopPropagation();
              playHover();
            }}
            onClick={(e) => {
              e.stopPropagation();
              playClick();
              onSelect(event.title);
            }}
          >
            <Shield size={18} />
            Conquer Event
          </button>
        </div>
      </div>
    </motion.div>
  );
};

interface EventsProps {
  onSelect: (title: string) => void;
}

const Events = ({ onSelect }: EventsProps) => {
  return (
    <section id="events" className="events-section">
      <div className="container">
        <div className="section-header">
          <motion.h2 
            className="section-title text-gradient"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Active Battlefronts
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Choose your arena and prepare for conquest.
          </motion.p>
        </div>

        <div className="events-grid">
          {eventsData.map((ev, idx) => (
            <EventCard key={ev.id} event={ev} index={idx} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;
