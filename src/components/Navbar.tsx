import { motion } from 'framer-motion';
import { Shield, Home, Film, MapPin, Ticket } from 'lucide-react';
import './Navbar.css';

interface NavbarProps {
  onNavigate: (destination: string) => void;
  activeView: string;
}

const Navbar = ({ onNavigate, activeView }: NavbarProps) => {
  return (
    <motion.nav 
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="navbar-container">
        <div 
          className="navbar-brand"
          onClick={() => onNavigate('home')}
        >
          <Shield size={24} className="brand-icon" />
          <span className="brand-text">DHURANDHAR</span>
        </div>

        <div className="navbar-links">
          <button 
            className={`nav-link ${activeView === 'home' ? 'active' : ''}`}
            onClick={() => onNavigate('home')}
          >
            <Home size={18} />
            <span>War Room</span>
          </button>
          
          <button 
            className="nav-link"
            onClick={() => onNavigate('movies')}
          >
            <Film size={18} />
            <span>Campaigns</span>
          </button>
          
          <button 
            className="nav-link"
            onClick={() => onNavigate('events')}
          >
            <MapPin size={18} />
            <span>Battlefronts</span>
          </button>
          
          <button 
            className={`nav-link ${activeView === 'status' ? 'active' : ''}`}
            onClick={() => onNavigate('status')}
          >
            <Ticket size={18} />
            <span>Conquests</span>
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
