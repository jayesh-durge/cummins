import { Volume2, VolumeX } from 'lucide-react';
import { useSound } from '../context/SoundContext';
import './AudioPlayer.css';

interface AudioPlayerProps {
  isPlaying: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ isPlaying }) => {
  const { isMuted, toggleMute, playHover } = useSound();

  if (!isPlaying) return null;

  return (
    <div className="audio-player">
      <button 
        className="audio-toggle-btn"
        onClick={toggleMute}
        onMouseEnter={playHover}
        title={isMuted ? "Unmute Epic Music" : "Mute Epic Music"}
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>
    </div>
  );
};

export default AudioPlayer;
