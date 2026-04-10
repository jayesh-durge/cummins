import { motion } from 'framer-motion';
import { Film, Star, Clock } from 'lucide-react';
import { useSound } from '../context/SoundContext';
import './Movies.css';

const moviesData = [
  {
    id: 1,
    title: "The Gladiator's Return",
    duration: "2h 45m",
    rating: "9.8",
    image: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=2670&auto=format&fit=crop",
    tags: ["Action", "Epic"],
  },
  {
    id: 2,
    title: "Cybernetic Warfare",
    duration: "2h 10m",
    rating: "8.9",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop",
    tags: ["Sci-Fi", "Thriller"],
  },
  {
    id: 3,
    title: "Kingdom of Blood",
    duration: "3h 15m",
    rating: "9.5",
    image: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=2574&auto=format&fit=crop",
    tags: ["Historical", "War"],
  },
  {
    id: 4,
    title: "Rogue Syndicate",
    duration: "1h 55m",
    rating: "9.1",
    image: "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=2628&auto=format&fit=crop",
    tags: ["Crime", "Action"],
  },
  {
    id: 5,
    title: "Neon Assassins",
    duration: "2h 05m",
    rating: "8.7",
    image: "https://images.unsplash.com/photo-1533327325824-76bc4e62d560?q=80&w=2669&auto=format&fit=crop",
    tags: ["Cyberpunk", "Action"],
  },
  {
    id: 6,
    title: "The Last Centurion",
    duration: "2h 30m",
    rating: "9.3",
    image: "https://images.unsplash.com/photo-1504253163732-650e14808d20?q=80&w=2670&auto=format&fit=crop",
    tags: ["Sci-Fi", "Drama"],
  },
  {
    id: 7,
    title: "Shadow Broker",
    duration: "2h 15m",
    rating: "8.8",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop",
    tags: ["Mystery", "Thriller"],
  },
  {
    id: 8,
    title: "Vanguard Protocol",
    duration: "2h 20m",
    rating: "9.0",
    image: "https://images.unsplash.com/photo-1521747116042-5a810fda9664?q=80&w=2670&auto=format&fit=crop",
    tags: ["War", "Tactical"],
  }
];

const MovieCard = ({ movie, index, onSelect }: { movie: any, index: number, onSelect: (id: string) => void }) => {
  const { playHover, playClick } = useSound();

  return (
    <motion.div 
      className="movie-card"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      whileHover={{ y: -15, scale: 1.02 }}
      onMouseEnter={playHover}
    >
      <div className="movie-poster-wrapper" onClick={playClick}>
        <img src={movie.image} alt={movie.title} className="movie-poster" />
        <div className="movie-overlay">
          <button 
            className="btn-play-trailer"
            onMouseEnter={(e) => {
              e.stopPropagation();
              playHover();
            }}
            onClick={(e) => {
              e.stopPropagation();
              playClick();
            }}
          >
            <Film size={24} />
          </button>
        </div>
        
        <div className="movie-rating">
          <Star size={14} className="star-icon" fill="currentColor" />
          <span>{movie.rating}</span>
        </div>
      </div>
      
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        
        <div className="movie-meta">
          <div className="meta-item">
            <Clock size={14} />
            <span>{movie.duration}</span>
          </div>
          <div className="movie-tags">
            {movie.tags.map((tag: string) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>
        
        <button 
          className="btn-book-movie mt-3"
          onMouseEnter={(e) => {
            e.stopPropagation();
            playHover();
          }}
          onClick={(e) => {
            e.stopPropagation();
            playClick();
            onSelect(movie.title);
          }}
        >
          Secure Tickets
        </button>
      </div>
    </motion.div>
  );
};

interface MoviesProps {
  onSelect: (title: string) => void;
}

const Movies = ({ onSelect }: MoviesProps) => {
  return (
    <section id="movies" className="movies-section">
      <div className="container">
        <div className="section-header">
          <motion.h2 
            className="section-title text-gradient"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Cinematic Campaigns
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Immerse yourself in the most heavily contested storylines.
          </motion.p>
        </div>

        <div className="movies-collection">
          {moviesData.map((movie, idx) => (
            <MovieCard key={movie.id} movie={movie} index={idx} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Movies;
