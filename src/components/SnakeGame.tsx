import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Point, Direction } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 120;

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ':
          if (gameOver) resetGame();
          else setIsPaused(p => !p);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);

  useEffect(() => {
    gameLoopRef.current = window.setInterval(moveSnake, GAME_SPEED);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, 400, 400);

    // Draw Grid (Brutal style)
    ctx.strokeStyle = '#ffffff22';
    ctx.lineWidth = 1;
    const cellSize = 400 / GRID_SIZE;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, 400);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(400, i * cellSize);
      ctx.stroke();
    }

    // Draw Food (Magenta Pulse)
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.fillRect(
      food.x * cellSize + 4,
      food.y * cellSize + 4,
      cellSize - 8,
      cellSize - 8
    );

    // Draw Snake (Cyan Block style)
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00ffff' : '#00ffff88';
      ctx.shadowBlur = index === 0 ? 20 : 0;
      ctx.shadowColor = '#00ffff';
      
      ctx.fillRect(
        segment.x * cellSize + 2,
        segment.y * cellSize + 2,
        cellSize - 4,
        cellSize - 4
      );

      // Add "static" to head
      if (index === 0 && Math.random() > 0.8) {
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(
          segment.x * cellSize + Math.random() * 5,
          segment.y * cellSize + Math.random() * 5,
          cellSize,
          2
        );
      }
    });
    
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[400px] mb-2 px-2 bg-black/40 border-l-4 border-[var(--color-glitch-magenta)] p-2">
        <div className="text-sm font-mono text-[var(--color-glitch-cyan)] uppercase tracking-tighter">
          DATA_STREAM: <span className="font-black">[{score.toString().padStart(4, '0')}]</span>
        </div>
        <div className="text-[10px] font-mono text-white/40 uppercase">
          {gameOver ? 'CRASHED' : isPaused ? 'HALTED' : 'EXCITING'}
        </div>
      </div>

      <div className="relative glitch-border bg-black">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="bg-black mix-blend-screen"
        />
        
        <AnimatePresence>
          {(isPaused || gameOver) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-md"
            >
              <div className="text-center p-8 border-2 border-white/10">
                <h2 
                  data-text={gameOver ? "SEGMENTATION FAULT" : "SYSTEM PAUSED"}
                  className={`text-3xl font-black mb-6 uppercase italic text-glitch ${gameOver ? 'text-[var(--color-glitch-magenta)]' : 'text-[var(--color-glitch-cyan)]'}`}
                >
                  {gameOver ? "SEGMENTATION FAULT" : "SYSTEM PAUSED"}
                </h2>
                <div className="space-y-4">
                  <button
                    onClick={gameOver ? resetGame : () => setIsPaused(false)}
                    className={`block w-full px-8 py-3 font-black uppercase text-xs italic tracking-[0.4em] transition-all
                      ${gameOver 
                        ? 'bg-[var(--color-glitch-magenta)]' 
                        : 'bg-[var(--color-glitch-cyan)]'} 
                      text-black shadow-[4px_4px_0px_white] active:translate-x-1 active:translate-y-1 active:shadow-none`}
                  >
                    {gameOver ? 'REBOOT' : 'CONTINUE'}
                  </button>
                  <p className="text-[9px] text-white/30 font-mono uppercase tracking-[0.2em]">
                    INPUT_CMD: [SPACE_KEY]
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
