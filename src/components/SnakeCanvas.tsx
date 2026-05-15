import React, { useEffect, useRef } from 'react';
import { Point, BonusType, Bonus, getBonusEmojis } from '../hooks/useSnakeLogic';

interface SnakeCanvasProps {
  snake: Point[];
  direction: Point;
  food: Point;
  bonus: Bonus | null;
  gridSize: number;
  gameOver: boolean;
  isJerryLevel: boolean;
  themeClass?: string;
  themeIndex?: number;
}

const THEME = {
  background: '#fef3c7', // amber-50 (warm indoor floor vibe)
  grid: 'rgba(0, 0, 0, 0.04)',
  arthur: '#5c3a21', // rich milk-chocolate brown
  arthurLight: '#8B5A2B',
};

export const SnakeCanvas: React.FC<SnakeCanvasProps> = ({
  snake,
  direction,
  food,
  bonus,
  gridSize,
  gameOver,
  isJerryLevel,
  themeClass,
  themeIndex = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const width = 400;
    const height = 400;
    
    // Scale canvas internally for crispness on high-DPI displays
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const cellSize = width / gridSize;
    const halfCell = cellSize / 2;

    // Clear board (relies on CSS background for base color)
    ctx.clearRect(0, 0, width, height);

    // Draw theme-specific grid
    if (themeIndex === 1) { // Neon Bowling
      ctx.fillStyle = 'rgba(0, 240, 255, 0.1)';
      for (let i = 0; i <= width; i += cellSize) {
        ctx.fillRect(i, 0, 1, height);
        ctx.fillRect(0, i, width, 1);
      }
      ctx.fillStyle = '#FF0055';
      for(let x=halfCell; x<width; x+=cellSize) {
         for(let y=halfCell; y<height; y+=cellSize) {
            ctx.fillRect(x-1, y-1, 2, 2);
         }
      }
    } else if (themeIndex === 2) { // Vaporwave
      ctx.fillStyle = 'rgba(255, 0, 255, 0.2)';
      for (let i = 0; i <= width; i += cellSize) {
        ctx.fillRect(i, 0, 2, height);
        ctx.fillRect(0, i, width, 2);
      }
      ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
      for(let x=cellSize; x<width; x+=cellSize) {
         for(let y=cellSize; y<height; y+=cellSize) {
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI*2);
            ctx.fill();
         }
      }
    } else if (themeIndex === 3) { // Retro Checkered Pink
      ctx.fillStyle = 'rgba(244, 114, 182, 0.15)'; // pink-400 with alpha
      for(let x=0; x<gridSize; x++) {
         for(let y=0; y<gridSize; y++) {
            if((x+y)%2 === 0) {
               ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
            }
         }
      }
    } else if (themeIndex === 4) { // Memphis
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)'; 
      ctx.lineWidth = 2;
      for(let x=0; x<gridSize; x++) {
         for(let y=0; y<gridSize; y++) {
            if((x+y) % 3 === 0) {
              ctx.beginPath();
              ctx.moveTo(x*cellSize + cellSize*0.2, y*cellSize + cellSize*0.2);
              ctx.lineTo(x*cellSize + cellSize*0.8, y*cellSize + cellSize*0.8);
              ctx.stroke();
            } else if ((x+y) % 3 === 1) {
              ctx.beginPath();
              ctx.arc(x*cellSize + halfCell, y*cellSize + halfCell, cellSize*0.2, 0, Math.PI*2);
              ctx.stroke();
            } else {
              ctx.fillStyle = 'rgba(0,0,0,0.05)';
              ctx.fillRect(x*cellSize + cellSize*0.3, y*cellSize + cellSize*0.3, cellSize*0.4, cellSize*0.4);
            }
         }
      }
    } else if (themeIndex === 5) { // Picnic Gingham
      ctx.fillStyle = 'rgba(239, 68, 68, 0.15)'; // red-500
      for (let i = 0; i <= width; i += cellSize) {
        ctx.fillRect(i, 0, cellSize/2, height);
        ctx.fillRect(0, i, width, cellSize/2);
      }
    } else if (themeIndex === 6) { // Diner
      ctx.fillStyle = 'rgba(220, 38, 38, 0.1)'; 
      for(let x=0; x<gridSize; x++) {
         for(let y=0; y<gridSize; y++) {
            if((x+y)%2 === 0) {
               ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
            }
         }
      }
    } else if (themeIndex === 7) { // Sports Grass
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= width; i += cellSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0); ctx.lineTo(i, height);
        ctx.moveTo(0, i); ctx.lineTo(width, i);
        ctx.stroke();
      }
    } else { // Fallback standard grid
      ctx.fillStyle = THEME.grid;
      for (let i = 0; i <= width; i += cellSize) {
        ctx.fillRect(i, 0, 1, height);
        ctx.fillRect(0, i, width, 1);
      }
    }

    // Shared Emoji Drawing Function
    const drawEmoji = (emoji: string, pt: Point, size: number) => {
      // Must set solid fillStyle and alpha before drawing text/emojis!
      // Otherwise it inherits the transparent grid fillStyle and becomes invisible.
      ctx.fillStyle = '#000000';
      ctx.globalAlpha = 1.0;
      ctx.font = `${size * 0.8}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Twemoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, pt.x * cellSize + halfCell, pt.y * cellSize + halfCell + (size * 0.05));
    };

    // Draw regular food (green piece of tire or Jerry)
    if (isJerryLevel) {
      drawEmoji('👴', food, cellSize * 1.3);
    } else {
      const fx = food.x * cellSize + halfCell;
      const fy = food.y * cellSize + halfCell;
      ctx.save();
      ctx.translate(fx, fy);
      ctx.fillStyle = '#2e7d32'; // Green tire outer
      ctx.beginPath();
      ctx.arc(0, 0, cellSize * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#143818'; // Dark hole
      ctx.beginPath();
      ctx.arc(0, 0, cellSize * 0.15, 0, Math.PI * 2);
      ctx.fill();
      // Tread marks
      ctx.strokeStyle = '#1b5e20'; // Darker green
      ctx.lineWidth = 1.5;
      for(let j=0; j<8; j++) {
         ctx.rotate(Math.PI / 4);
         ctx.beginPath();
         ctx.moveTo(cellSize * 0.2, 0);
         ctx.lineTo(cellSize * 0.4, 0);
         ctx.stroke();
      }
      ctx.restore();
    }

    // Draw bonus food (stuffed animals)
    if (bonus) {
      const THEME_EMOJIS = getBonusEmojis(themeIndex);
      drawEmoji(THEME_EMOJIS[bonus.type], bonus, cellSize * 1.25);
    }

    // Draw Arthur (Snake)
    // Draw from tail to head so head renders ON TOP of body
    
    for (let i = snake.length - 1; i >= 0; i--) {
      const segment = snake[i];
      const isHead = i === 0;
      const isTail = i === snake.length - 1;
      
      const cx = segment.x * cellSize + halfCell;
      const cy = segment.y * cellSize + halfCell;

      ctx.save();
      ctx.translate(cx, cy);

      if (isHead) {
        // Head Rotation
        const angle = Math.atan2(direction.y, direction.x);
        ctx.rotate(angle);

        // Base head (curly look)
        ctx.fillStyle = THEME.arthur;
        ctx.beginPath();
        for (let j = 0; j < 12; j++) {
          const a = (j / 12) * Math.PI * 2;
          const r = cellSize * 0.55; 
          ctx.arc(Math.cos(a)*r*0.4, Math.sin(a)*r*0.4, r*0.7, 0, Math.PI*2);
        }
        ctx.fill();

        // Floppy Ears
        ctx.fillStyle = THEME.arthur;
        // Left Ear
        ctx.beginPath();
        ctx.ellipse(-cellSize * 0.15, -cellSize * 0.5, cellSize * 0.4, cellSize * 0.25, Math.PI / 5, 0, Math.PI * 2);
        ctx.fill();
        // Right Ear
        ctx.beginPath();
        ctx.ellipse(-cellSize * 0.15, cellSize * 0.5, cellSize * 0.4, cellSize * 0.25, -Math.PI / 5, 0, Math.PI * 2);
        ctx.fill();

        // Snout
        ctx.fillStyle = THEME.arthurLight;
        ctx.beginPath();
        ctx.arc(cellSize * 0.25, 0, cellSize * 0.35, 0, Math.PI * 2);
        ctx.fill();

        // Nose
        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.ellipse(cellSize * 0.45, 0, cellSize * 0.08, cellSize * 0.12, 0, 0, Math.PI * 2);
        ctx.fill();

        if (gameOver) {
           ctx.strokeStyle = '#222';
           ctx.lineWidth = Math.max(2, cellSize * 0.1);
           ctx.lineCap = 'round';
           const ex = cellSize * 0.1;
           const ey = cellSize * 0.25;
           const s = cellSize * 0.1;
           // left eye X
           ctx.beginPath(); ctx.moveTo(ex-s, -ey-s); ctx.lineTo(ex+s, -ey+s); ctx.stroke();
           ctx.beginPath(); ctx.moveTo(ex+s, -ey-s); ctx.lineTo(ex-s, -ey+s); ctx.stroke();
           // right eye X
           ctx.beginPath(); ctx.moveTo(ex-s, ey-s); ctx.lineTo(ex+s, ey+s); ctx.stroke();
           ctx.beginPath(); ctx.moveTo(ex+s, ey-s); ctx.lineTo(ex-s, ey+s); ctx.stroke();
        } else {
           // White of eyes
           ctx.fillStyle = '#fff';
           ctx.beginPath(); ctx.arc(cellSize * 0.1, -cellSize * 0.25, cellSize * 0.12, 0, Math.PI * 2); ctx.fill(); // Left
           ctx.beginPath(); ctx.arc(cellSize * 0.08, cellSize * 0.25, cellSize * 0.12, 0, Math.PI * 2); ctx.fill(); // Right
           
           // Left Eye (Normal Brown)
           ctx.fillStyle = '#220b00'; 
           ctx.beginPath(); ctx.arc(cellSize * 0.14, -cellSize * 0.25, cellSize * 0.06, 0, Math.PI * 2); ctx.fill();
           
           // Right Eye (Blind - Cloudy Greyish Blue)
           ctx.fillStyle = '#a8c6db'; // Cloudy blue
           ctx.beginPath(); ctx.arc(cellSize * 0.1, cellSize * 0.25, cellSize * 0.09, 0, Math.PI * 2); ctx.fill();
           // Slight cataract glow on the blind eye
           ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
           ctx.beginPath(); ctx.arc(cellSize * 0.1, cellSize * 0.25, cellSize * 0.04, 0, Math.PI * 2); ctx.fill();
           
           // Tongue
           ctx.fillStyle = '#ff77aa';
           ctx.beginPath();
           ctx.ellipse(cellSize * 0.4, cellSize * 0.25, cellSize * 0.15, cellSize * 0.08, Math.PI / 4, 0, Math.PI * 2);
           ctx.fill();
           // Tongue line
           ctx.strokeStyle = '#d6336c';
           ctx.lineWidth = 1;
           ctx.beginPath();
           ctx.moveTo(cellSize * 0.35, cellSize * 0.25);
           ctx.lineTo(cellSize * 0.45, cellSize * 0.32);
           ctx.stroke();
        }
      } else if (isTail) {
        // Tail is smaller
        ctx.fillStyle = THEME.arthur;
        ctx.beginPath();
        ctx.arc(0, 0, cellSize * 0.35, 0, Math.PI * 2);
        ctx.fill();
        // Little nub
        ctx.beginPath();
        // Target towards previous segment
        const prev = snake[i - 1];
        if (prev) {
           const dx = segment.x - prev.x;
           const dy = segment.y - prev.y;
           ctx.arc(dx * cellSize * 0.25, dy * cellSize * 0.25, cellSize * 0.2, 0, Math.PI * 2);
           ctx.fill();
        }
      } else {
        // Body segment - fluffy curling edges
        ctx.fillStyle = THEME.arthur;
        ctx.beginPath();
        for (let j = 0; j < 12; j++) {
          const a = (j / 12) * Math.PI * 2;
          const r = cellSize * 0.4;
          ctx.arc(Math.cos(a)*r, Math.sin(a)*r, cellSize*0.45, 0, Math.PI*2);
        }
        ctx.fill();
        
        // Add a slight lighter brown spot for curly texture
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.beginPath();
        ctx.arc(-cellSize * 0.1, -cellSize * 0.1, cellSize * 0.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

  }, [snake, direction, food, bonus, gridSize, gameOver, isJerryLevel, themeIndex]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      className={`w-full h-auto aspect-square rounded-xl ${themeClass || 'bg-amber-50 shadow-[4px_4px_0_0_rgb(17,24,39)] border-[3px] border-gray-900'}`}
      style={{ touchAction: 'none' }}
    />
  );
};
