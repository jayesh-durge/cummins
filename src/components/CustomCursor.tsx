import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CustomCursor.css';

interface Bullet {
  id: number;
  x: number;
  y: number;
}

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClicked, setIsClicked] = useState(false);
  const [bullets, setBullets] = useState<Bullet[]>([]);

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const mouseDown = (e: MouseEvent) => {
      setIsClicked(true);
      
      // Fire a golden bullet!
      const newBullet = { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY };
      setBullets(prev => [...prev, newBullet]);
      
      // Remove the bullet after its lifecycle
      setTimeout(() => {
        setBullets(prev => prev.filter(b => b.id !== newBullet.id));
      }, 400); // 400ms is enough for a short distance shot
    };

    const mouseUp = () => setIsClicked(false);

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mousedown', mouseDown);
    window.addEventListener('mouseup', mouseUp);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mousedown', mouseDown);
      window.removeEventListener('mouseup', mouseUp);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {bullets.map(bullet => (
          <motion.div
            key={bullet.id}
            className="golden-bullet"
            initial={{ x: bullet.x, y: bullet.y, opacity: 1, scale: 1 }}
            animate={{ 
              x: bullet.x - 100, // Shoot towards top-left
              y: bullet.y - 100, 
              opacity: 0,
              scale: 0.5 
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            exit={{ opacity: 0 }}
          />
        ))}
      </AnimatePresence>

      <motion.div
        className="gun-cursor"
        style={{
          x: mousePosition.x - 4, // Align the barrel to the exact click coordinate
          y: mousePosition.y - 4,
        }}
        animate={{
          scale: isClicked ? 1.2 : 1,
          rotate: isClicked ? -15 : 0 // Recoil effect pointing top-left
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Sifi Pistol Body pointing top-left */}
          <path d="M4 4 L14 14 L20 10 L10 2 Z" fill="#444" stroke="#a0a0a0" strokeWidth="1" />
          <path d="M12 16 L18 24 L24 20 L16 12 Z" fill="#d91c1c" stroke="#ff2a2a" strokeWidth="1" />
          <circle cx="8" cy="8" r="2" fill="#fff" />
        </svg>
      </motion.div>
    </>
  );
}
