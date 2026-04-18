import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DUMMY_TRACKS } from '../types';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('SIGNAL_INTERRUPTED:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleEnded = () => handleNext();

  return (
    <div className="w-full max-w-md bg-black glitch-border p-4 flex flex-col gap-6 relative group overflow-hidden">
      {/* Background Chromatic Aberration Simulation */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[var(--color-glitch-magenta)] mix-blend-screen translate-x-1" />
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[var(--color-glitch-cyan)] mix-blend-screen -translate-x-1" />

      <div className="flex gap-4">
        <motion.div 
          key={currentTrack.id}
          className="relative w-32 h-32 bg-[var(--color-glitch-magenta)] p-1"
        >
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className="w-full h-full object-cover filter grayscale contrast-150 brightness-75 mix-blend-multiply"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-0 right-0 p-1 bg-[var(--color-glitch-cyan)] text-[8px] font-bold text-black uppercase">
            {isPlaying ? 'RUNNING' : 'HALTED'}
          </div>
          {isPlaying && (
            <div className="absolute inset-0 border-2 border-[var(--color-glitch-cyan)] animate-[ping_1.5s_infinite]" />
          )}
        </motion.div>

        <div className="flex-grow min-w-0 flex flex-col justify-end">
          <h3 
            data-text={currentTrack.title}
            className="text-2xl font-black text-[var(--color-glitch-cyan)] uppercase italic tracking-tighter truncate leading-none mb-2"
          >
            {currentTrack.title}
          </h3>
          <p className="text-[10px] uppercase font-mono text-[var(--color-glitch-magenta)] tracking-[0.2em] truncate">
            {currentTrack.artist} // SRC: {currentTrack.id.padStart(3, '0')}
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[8px] font-mono text-white/40 uppercase mb-1">
          <span>PROGRESS_STATE</span>
          <span>{audioRef.current ? `${formatTime(audioRef.current.currentTime)} / ${formatTime(audioRef.current.duration)}` : 'NULL'}</span>
        </div>
        <div className="w-full h-4 bg-white/5 relative border border-white/10 overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-[var(--color-glitch-cyan)]"
            animate={{ width: `${progress}%` }}
          />
          {/* Subtle glitch bars on progress */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="flex-1 border-r border-black/20" />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button 
            onClick={handlePrev}
            className="p-3 border border-white/10 hover:bg-[var(--color-glitch-cyan)] hover:text-black transition-colors"
          >
            <SkipBack size={18} />
          </button>
          <button 
            onClick={handleNext}
            className="p-3 border border-white/10 hover:bg-[var(--color-glitch-cyan)] hover:text-black transition-colors"
          >
            <SkipForward size={18} />
          </button>
        </div>

        <button 
          onClick={togglePlay}
          className={`flex items-center gap-3 px-8 py-3 font-black uppercase text-sm italic tracking-widest transition-all
            ${isPlaying 
              ? 'bg-[var(--color-glitch-magenta)] text-black' 
              : 'bg-[var(--color-glitch-cyan)] text-black'} 
            hover:scale-105 active:scale-95 shadow-[4px_4px_0px_white]`}
        >
          {isPlaying ? <><Pause size={20} /> Pause</> : <><Play size={20} /> Play</>}
        </button>
      </div>

      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
    </div>
  );
}

function formatTime(seconds: number) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
