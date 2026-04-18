/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal, Activity, Zap, ShieldAlert } from 'lucide-react';

export default function App() {
  return (
    <main className="min-h-screen w-full relative overflow-hidden bg-[var(--color-dark-void)] flex flex-col items-center justify-center p-4 static-noise">
      {/* Visual Glitch Elements */}
      <div className="scanline" />
      
      {/* Floating Artifacts */}
      <motion.div 
        animate={{ 
          x: [0, 50, -50, 0], 
          y: [0, -30, 30, 0],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-32 h-1 bg-[var(--color-glitch-magenta)] blur-sm" 
      />
      <motion.div 
        animate={{ 
          x: [0, -40, 40, 0], 
          y: [0, 40, -40, 0],
          opacity: [0.1, 0.4, 0.1]
        }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute bottom-1/4 right-1/4 w-1 h-32 bg-[var(--color-glitch-cyan)] blur-sm" 
      />

      <div className="z-20 w-full max-w-7xl flex flex-col gap-12 items-center">
        {/* Header Frame */}
        <header className="relative w-full text-center py-8">
          <div className="absolute inset-0 border-y-2 border-[var(--color-glitch-cyan)] opacity-20 scale-x-110" />
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-4 px-6 py-2 glitch-border bg-black mb-6"
          >
            <ShieldAlert size={18} className="text-[var(--color-glitch-magenta)] animate-pulse" />
            <span className="text-xs uppercase tracking-[0.5em] text-[var(--color-glitch-magenta)] font-bold">
              UNAUTHORIZED ACCESS DETECTED
            </span>
          </motion.div>

          <h1 
            data-text="GLITCH // SLITHER"
            className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic text-glitch text-[var(--color-glitch-cyan)]"
          >
            GLITCH // SLITHER
          </h1>
          
          <div className="mt-4 flex justify-center items-center gap-8 text-[10px] uppercase font-mono text-white/40">
            <span className="flex items-center gap-2">
              <Activity size={12} /> SIGNAL: 100% UNSTABLE
            </span>
            <span className="flex items-center gap-2">
              <Zap size={12} /> VOID ENERGY: CRITICAL
            </span>
          </div>
        </header>

        {/* Content Lattice */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-8 w-full p-6 border-x-2 border-white/5 bg-white/[0.02]">
          {/* Game Core */}
          <section className="flex flex-col items-center">
            <div className="w-full max-w-[400px] mb-4 flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[10px] font-mono text-white/30 flex items-center gap-2">
                <Terminal size={10} /> CORE_ENGINE.EXE
              </span>
              <span className="text-[10px] font-mono text-white/30">LATEST_LOG: 0xDEADBEEF</span>
            </div>
            <SnakeGame />
          </section>

          {/* Audio Core */}
          <aside className="flex flex-col gap-8">
            <div className="relative">
              <div className="absolute -top-3 left-4 px-2 bg-[var(--color-dark-void)] text-[10px] font-mono text-[var(--color-glitch-magenta)] z-10">
                AUDIO_TRANSMISSION.01
              </div>
              <MusicPlayer />
            </div>

            {/* Cryptic Stats */}
            <div className="glitch-border bg-black/80 p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-xs font-bold text-[var(--color-glitch-yellow)] uppercase tracking-widest">System Logs</span>
                <span className="w-2 h-2 bg-[var(--color-glitch-magenta)] animate-ping" />
              </div>
              <ul className="text-[10px] font-mono space-y-2 opacity-60 overflow-hidden max-h-32">
                <li>[INFO] PREPARING_NEURAL_SNAKE...</li>
                <li>[WARN] BUFFER_OVERFLOW_IN_AUDIO_STREAM</li>
                <li>[ERROR] REALITY_COLLAPSE_IN_GRID_24</li>
                <li>[OK] VOID_SYNC_COMPLETE</li>
                <li>[INFO] WAITING_FOR_INPUT...</li>
              </ul>
            </div>
          </aside>
        </div>

        {/* Footer Rail */}
        <footer className="w-full flex justify-between items-end border-t border-[var(--color-glitch-cyan)]/20 pt-8 mt-8 pb-12">
          <div className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em]">
            // BUILT_BY: RETRO_FUTURIST_OS_v0.1<br />
            // STATUS: DESYNCED
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-1 bg-[var(--color-glitch-magenta)]" />
            <div className="w-8 h-1 bg-[var(--color-glitch-cyan)]" />
            <div className="w-4 h-1 bg-[var(--color-glitch-yellow)]" />
          </div>
        </footer>
      </div>
    </main>
  );
}
