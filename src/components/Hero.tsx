import { motion } from 'framer-motion';
import { Sword } from 'lucide-react';
import { useSound } from '../context/SoundContext';
import { EmbersSurface } from './ui/EmbersSurface';
import './Hero.css';

const Hero = () => {
  const { playHover, playClick } = useSound();

  return (
    <section className="hero-section">
      <EmbersSurface />
      <div className="hero-overlay"></div>
      
      <div className="container hero-container">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div 
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Sword size={18} />
            <span>The Ultimate Battleground</span>
            <Sword size={18} />
          </motion.div>
          
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 1.5 }}
          >
            Conquer <br /> 
            <span className="text-gradient">Your Seat</span>
          </motion.h1>
          
          <motion.p 
            className="hero-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            Don't just book a ticket. Claim your territory in the most epic event of the year. 
            Strategy, speed, and power decide where you sit.
          </motion.p>
          
          <motion.div 
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <button 
              className="btn-primary"
              onMouseEnter={playHover}
              onClick={playClick}
            >
              View Battlegrounds
            </button>
            <button 
              className="btn-ghost"
              onMouseEnter={playHover}
              onClick={playClick}
            >
              Rules of Engagement
            </button>
          </motion.div>
        </motion.div>
      </div>

      <div className="hero-particles">
        {/* Simple CSS particles for atmospheric ash/embers */}
        {[...Array(20)].map((_, i) => (
          <div key={i} className="ember" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 3 + 3}s`
          }}></div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
