import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useSnakeLogic, BonusType, getBonusEmojis } from './hooks/useSnakeLogic';
import { SnakeCanvas } from './components/SnakeCanvas';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Play, RotateCcw, Pause, Trophy, Star, Palette } from 'lucide-react';

const THEMES = {
  1: {
    panel: 'bg-[#1a1025]/95 border-[3px] border-[#00F0FF] shadow-[4px_4px_0_0_#FF0055]',
    panelInner: 'bg-[#2a1a3a] border-2 border-[#00F0FF] shadow-sm',
    textHead: 'text-[#00F0FF]',
    textSub: 'text-[#FFEA00]',
    textMuted: 'text-[#FF0055]',
    textInv: 'text-white',
    button: 'bg-[#2a1a3a] text-[#00F0FF] border-[3px] border-[#00F0FF] shadow-[0_4px_0_#FF0055] hover:bg-[#3a2a4a]',
    canvas: 'bg-[#40275c] border-[3px] border-[#00F0FF] shadow-[4px_4px_0_0_#FF0055]',
    overlay: 'bg-black/70 backdrop-blur-sm',
    overlayPanel: 'bg-[#1a1025] border-[3px] border-[#00F0FF] shadow-[6px_6px_0_0_#FF0055]',
    primaryBtn: 'bg-[#FF0055] hover:bg-[#d00044] text-white',
    successBtn: 'bg-[#00FF00] hover:bg-[#00cc00] text-[#1a1025]',
    dangerBtn: 'bg-[#FF0055] hover:bg-[#d00044] text-white',
    bonusUnf: 'bg-[#2a1a3a] border-[#1a1025]',
    bonusFnd: 'bg-[#0f0916] border-[#00F0FF] shadow-inner',
    title: 'Stuffed Animals',
  },
  2: {
    panel: 'bg-[#2b1055]/95 border-[3px] border-[#00ffff] shadow-[4px_4px_0_0_#ff00ff]',
    panelInner: 'bg-[#43187a] border-2 border-[#00ffff] shadow-sm',
    textHead: 'text-[#00ffff]',
    textSub: 'text-[#ffff00]',
    textMuted: 'text-[#ff00ff]',
    textInv: 'text-white',
    button: 'bg-[#43187a] text-[#00ffff] border-[3px] border-[#00ffff] shadow-[0_4px_0_#ff00ff] hover:bg-[#5b22a6]',
    canvas: 'bg-[#190833] border-[3px] border-[#00ffff] shadow-[4px_4px_0_0_#ff00ff]',
    overlay: 'bg-[#190833]/70 backdrop-blur-sm',
    overlayPanel: 'bg-[#2b1055] border-[3px] border-[#00ffff] shadow-[6px_6px_0_0_#ff00ff]',
    primaryBtn: 'bg-[#ff00ff] hover:bg-[#d900d9] text-white',
    successBtn: 'bg-[#00ffff] hover:bg-[#00cccc] text-[#2b1055]',
    dangerBtn: 'bg-[#ff00ff] hover:bg-[#d900d9] text-white',
    bonusUnf: 'bg-[#43187a] border-[#2b1055]',
    bonusFnd: 'bg-[#190833] border-[#00ffff] shadow-inner',
    title: 'Stuffed Animals',
  },
  3: {
    panel: 'bg-white/95 border-[3px] border-pink-500 shadow-[4px_4px_0_0_#be185d]',
    panelInner: 'bg-pink-50 border-2 border-pink-400 shadow-sm',
    textHead: 'text-pink-700',
    textSub: 'text-pink-900',
    textMuted: 'text-pink-600',
    textInv: 'text-white',
    button: 'bg-pink-50 text-pink-700 border-[3px] border-pink-500 shadow-[0_4px_0_#be185d] hover:bg-pink-100',
    canvas: 'bg-pink-50 border-[3px] border-pink-500 shadow-[4px_4px_0_0_#be185d]',
    overlay: 'bg-pink-900/40 backdrop-blur-sm',
    overlayPanel: 'bg-white border-[3px] border-pink-500 shadow-[6px_6px_0_0_#be185d]',
    primaryBtn: 'bg-pink-500 hover:bg-pink-600 text-white',
    successBtn: 'bg-pink-400 hover:bg-pink-500 text-white',
    dangerBtn: 'bg-rose-500 hover:bg-rose-600 text-white',
    bonusUnf: 'bg-white border-pink-200',
    bonusFnd: 'bg-pink-100 border-pink-500 shadow-inner',
    title: 'Stuffed Animals',
  },
  4: {
    panel: 'bg-white/95 border-[3px] border-black shadow-[4px_4px_0_0_#000]',
    panelInner: 'bg-yellow-100 border-2 border-black shadow-sm',
    textHead: 'text-black',
    textSub: 'text-gray-800',
    textMuted: 'text-gray-600',
    textInv: 'text-white',
    button: 'bg-yellow-200 text-black border-[3px] border-black shadow-[0_4px_0_#000] hover:bg-yellow-300',
    canvas: 'bg-blue-50 border-[3px] border-black shadow-[4px_4px_0_0_#000]',
    overlay: 'bg-black/50 backdrop-blur-sm',
    overlayPanel: 'bg-white border-[3px] border-black shadow-[6px_6px_0_0_#000]',
    primaryBtn: 'bg-blue-500 hover:bg-blue-600 text-white',
    successBtn: 'bg-green-500 hover:bg-green-600 text-white',
    dangerBtn: 'bg-orange-500 hover:bg-orange-600 text-white',
    bonusUnf: 'bg-white border-gray-300',
    bonusFnd: 'bg-yellow-100 border-black shadow-inner',
    title: 'Stuffed Animals',
  },
  5: {
    panel: 'bg-white/95 border-[3px] border-red-800 shadow-[4px_4px_0_0_#991b1b]',
    panelInner: 'bg-red-50 border-2 border-red-800 shadow-sm',
    textHead: 'text-red-900',
    textSub: 'text-red-950',
    textMuted: 'text-red-700',
    textInv: 'text-white',
    button: 'bg-white text-red-900 border-[3px] border-red-800 shadow-[0_4px_0_#991b1b] hover:bg-red-50',
    canvas: 'bg-red-50 border-[3px] border-red-800 shadow-[4px_4px_0_0_#991b1b]',
    overlay: 'bg-red-950/40 backdrop-blur-sm',
    overlayPanel: 'bg-white border-[3px] border-red-800 shadow-[6px_6px_0_0_#991b1b]',
    primaryBtn: 'bg-red-600 hover:bg-red-700 text-white',
    successBtn: 'bg-green-600 hover:bg-green-700 text-white',
    dangerBtn: 'bg-red-600 hover:bg-red-700 text-white',
    bonusUnf: 'bg-white border-red-200',
    bonusFnd: 'bg-red-50 border-red-800 shadow-inner',
    title: 'Stuffed Animals',
  },
  6: {
    panel: 'bg-yellow-50/95 border-[3px] border-red-500 shadow-[4px_4px_0_0_#b91c1c]',
    panelInner: 'bg-white border-2 border-red-400 shadow-sm',
    textHead: 'text-red-600',
    textSub: 'text-yellow-700',
    textMuted: 'text-red-500',
    textInv: 'text-white',
    button: 'bg-white text-red-600 border-[3px] border-red-500 shadow-[0_4px_0_#b91c1c] hover:bg-yellow-100',
    canvas: 'bg-yellow-100 border-[3px] border-red-500 shadow-[4px_4px_0_0_#b91c1c]',
    overlay: 'bg-red-900/40 backdrop-blur-sm',
    overlayPanel: 'bg-yellow-50 border-[3px] border-red-500 shadow-[6px_6px_0_0_#b91c1c]',
    primaryBtn: 'bg-red-500 hover:bg-red-600 text-white',
    successBtn: 'bg-green-500 hover:bg-green-600 text-white',
    dangerBtn: 'bg-red-600 hover:bg-red-700 text-white',
    bonusUnf: 'bg-white border-yellow-300',
    bonusFnd: 'bg-yellow-100 border-red-500 shadow-inner',
    title: 'Junk Food',
  },
  7: {
    panel: 'bg-green-900/95 border-[3px] border-white shadow-[4px_4px_0_0_#14532d]',
    panelInner: 'bg-green-800 border-2 border-green-400 shadow-sm',
    textHead: 'text-white',
    textSub: 'text-green-300',
    textMuted: 'text-green-400',
    textInv: 'text-green-900',
    button: 'bg-green-800 text-white border-[3px] border-white shadow-[0_4px_0_#14532d] hover:bg-green-700',
    canvas: 'bg-green-800 border-[3px] border-white shadow-[4px_4px_0_0_#14532d]',
    overlay: 'bg-black/50 backdrop-blur-sm',
    overlayPanel: 'bg-green-900 border-[3px] border-white shadow-[6px_6px_0_0_#14532d]',
    primaryBtn: 'bg-white hover:bg-gray-200 text-green-900',
    successBtn: 'bg-green-500 hover:bg-green-600 text-white',
    dangerBtn: 'bg-red-500 hover:bg-red-600 text-white',
    bonusUnf: 'bg-green-800 border-green-600',
    bonusFnd: 'bg-green-700 border-white shadow-inner',
    title: 'Sports Balls',
  }
};

export default function App() {
  const [themeIndex, setThemeIndex] = useState(() => {
    try {
      const saved = localStorage.getItem('arthur_theme');
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('arthur_theme', themeIndex.toString());
    } catch {}
  }, [themeIndex]);

  const cycleTheme = useCallback(() => {
    setThemeIndex(prev => prev >= 7 ? 1 : prev + 1);
  }, []);

  const {
    snake,
    direction,
    food,
    bonus,
    score,
    highScore,
    gameOver,
    hasWon,
    isJerryLevel,
    eatenAnimals,
    lastEatenEvent,
    isPaused,
    hasStarted,
    gridSize,
    bonusTypes,
    changeDirection,
    resetGame,
    setIsPaused,
    setHasStarted,
    isEndlessMode,
    setIsEndlessMode
  } = useSnakeLogic();

  const [particles, setParticles] = useState<{id: number, x: number, y: number, type: BonusType}[]>([]);
  const touchStartRef = useRef<{x: number, y: number} | null>(null);

  useEffect(() => {
    if (lastEatenEvent) {
      setParticles(p => [...p, lastEatenEvent]);
      const token = setTimeout(() => {
        setParticles(p => p.filter(x => x.id !== lastEatenEvent.id));
      }, 600);
      return () => clearTimeout(token);
    }
  }, [lastEatenEvent]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          changeDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          changeDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          changeDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          changeDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (!hasStarted) setHasStarted(true);
          else if (gameOver || hasWon) resetGame();
          else setIsPaused((p) => !p);
          break;
        case '1': setThemeIndex(1); break;
        case '2': setThemeIndex(2); break;
        case '3': setThemeIndex(3); break;
        case '4': setThemeIndex(4); break;
        case '5': setThemeIndex(5); break;
        case '6': setThemeIndex(6); break;
        case '7': setThemeIndex(7); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection, hasStarted, gameOver, hasWon, resetGame, setIsPaused, setHasStarted]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    
    // Minimum distance for a swipe vs just a tap
    if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
      if (Math.abs(dx) > Math.abs(dy)) {
        changeDirection({ x: dx > 0 ? 1 : -1, y: 0 });
      } else {
        changeDirection({ x: 0, y: dy > 0 ? 1 : -1 });
      }
    }
    touchStartRef.current = null;
  };

  const theme = THEMES[themeIndex as keyof typeof THEMES];

  return (
    <div 
      className={`min-h-[100dvh] w-full bg-theme-${themeIndex} flex flex-col items-center justify-start xl:justify-center p-2 sm:p-4 font-sans overflow-x-hidden transition-all duration-500`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex flex-col md:flex-row gap-2 sm:gap-6 items-center md:items-start w-full max-w-3xl justify-center pt-2 sm:pt-8 pb-4 md:py-0">
        
        <div className="w-full max-w-[400px] max-h-[100dvh] flex flex-col gap-2 sm:gap-4 shrink-0 px-1 sm:px-0">
          
          {/* Header */}
          <div className={`flex items-center justify-between p-2 sm:p-4 rounded-xl sm:rounded-2xl shrink-0 transition-colors duration-500 relative ${theme.panel}`}>
            <div>
              <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight transition-colors duration-500 flex items-center gap-2 ${theme.textHead}`}>
                Arthur
                <button 
                  onClick={cycleTheme}
                  className={`p-1.5 rounded-full active:scale-95 transition-all duration-500 ${theme.panelInner}`}
                  title="Change Theme"
                >
                  <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </h1>
              <p className={`text-xs sm:text-sm font-medium leading-none mt-1 transition-colors duration-500 ${theme.textSub}`}>The Very Hungry Dog</p>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              {hasStarted && !gameOver && !hasWon && (
                <button 
                   className={`p-1.5 sm:p-2 rounded-full active:scale-95 transition-all duration-500 shrink-0 ${theme.panelInner} ${theme.textHead}`}
                   onClick={() => setIsPaused(p => !p)}
                   aria-label={isPaused ? "Resume" : "Pause"}
                >
                   {isPaused ? <Play className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" /> : <Pause className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" />}
                </button>
              )}
              <div className={`flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors duration-500 ${theme.panelInner} ${theme.textHead}`}>
                <div className="flex flex-col items-end pr-1 sm:pr-2 border-r border-current/20">
                   <div className="text-[9px] sm:text-[10px] uppercase font-extrabold opacity-70 leading-none">Best</div>
                   <div className="text-xs sm:text-sm font-black leading-none mt-0.5">{highScore}</div>
                </div>
                <Trophy className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                <span className="text-lg sm:text-xl font-black">{score}</span>
              </div>
            </div>
          </div>

          {/* Game Area */}
          <div className={`relative w-full aspect-square max-w-[340px] sm:max-w-full mx-auto shrink transition-colors duration-500 ${gameOver && !hasWon ? 'animate-shake' : ''}`}>
            <div className="absolute inset-0">
              <SnakeCanvas
                snake={snake}
                direction={direction}
                food={food}
                bonus={bonus}
                gridSize={gridSize}
                gameOver={gameOver}
                isJerryLevel={isJerryLevel}
                themeClass={`transition-colors duration-500 ${theme.canvas}`}
                themeIndex={themeIndex}
              />
            </div>

            {/* Particle Effects */}
            {particles.map(p => (
              <div key={p.id} className="absolute pointer-events-none z-20" style={{ left: `${(p.x + 0.5) / gridSize * 100}%`, top: `${(p.y + 0.5) / gridSize * 100}%` }}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="absolute text-xl sm:text-3xl animate-particle" style={{
                    '--dx': `${Math.cos(i * Math.PI / 3) * 60}px`,
                    '--dy': `${Math.sin(i * Math.PI / 3) * 60}px`,
                    '--rot': `${Math.random() * 360}deg`
                  } as React.CSSProperties}>
                    {getBonusEmojis(themeIndex)[p.type]}
                  </div>
                ))}
              </div>
            ))}
            
            {/* Overlays */}
            {(!hasStarted || gameOver || hasWon || isPaused) && (
              <div className={`absolute inset-0 rounded-xl sm:rounded-2xl flex items-center justify-center p-4 sm:p-6 z-10 overflow-hidden transition-colors duration-500 ${theme.overlay}`}>
                <div className={`rounded-2xl p-4 sm:p-6 text-center w-[95%] flex flex-col items-center animate-in zoom-in duration-200 transition-colors ${theme.overlayPanel}`}>
                  {!hasStarted ? (
                    <>
                      <h2 className={`text-xl sm:text-2xl font-bold mb-2 transition-colors duration-500 ${theme.textHead}`}>Ready to play?</h2>
                      <p className={`mb-4 sm:mb-6 text-xs sm:text-sm transition-colors duration-500 ${theme.textSub}`}>Help Arthur eat his green tires and chew up all 5 of his favorite {theme.title.toLowerCase()}! He's blind in one eye but he's very hungry.</p>
                      <button 
                        onClick={() => setHasStarted(true)}
                        className={`font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full shadow-lg active:scale-95 transition-all text-base sm:text-lg flex items-center gap-2 ${theme.primaryBtn}`}
                      >
                        <Play fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5"/> Play Now
                      </button>
                    </>
                  ) : gameOver && !hasWon ? (
                    <>
                      <h2 className={`text-2xl sm:text-3xl font-black mb-2 transition-colors duration-500 ${theme.textMuted}`}>Woof!</h2>
                      <p className={`mb-4 sm:mb-6 text-sm sm:text-base font-medium transition-colors duration-500 ${theme.textSub}`}>Arthur bumped into something.<br/>Final Score: {score} green tires</p>
                      <button 
                        onClick={resetGame}
                        className={`font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full shadow-lg active:scale-95 transition-all text-base sm:text-lg flex items-center gap-2 ${theme.dangerBtn}`}
                      >
                        <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5"/> Try Again
                      </button>
                    </>
                  ) : hasWon ? (
                    <>
                      <h2 className={`text-2xl sm:text-3xl font-black mb-2 transition-colors duration-500 ${theme.textHead}`}>You Win!</h2>
                      <p className={`mb-4 sm:mb-6 text-sm sm:text-base font-medium transition-colors duration-500 ${theme.textSub}`}>Arthur ate Jerry! He is full now.<br/>Final Score: {score} green tires</p>
                      <button 
                        onClick={resetGame}
                        className={`font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full shadow-lg active:scale-95 transition-all text-base sm:text-lg flex items-center gap-2 ${theme.successBtn}`}
                      >
                        <Star fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5"/> Play Again
                      </button>
                    </>
                  ) : isPaused ? (
                    <>
                      <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 transition-colors duration-500 ${theme.textHead}`}>Paused</h2>
                      <button 
                        onClick={() => setIsPaused(false)}
                        className={`font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full shadow-lg active:scale-95 transition-all text-base sm:text-lg flex items-center gap-2 ${theme.primaryBtn}`}
                      >
                        <Play fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5"/> Resume
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-2 shrink-0 select-none">
            <div className={`grid grid-cols-3 gap-3 p-4 rounded-[2rem] w-fit mx-auto aspect-[3/2.2] transition-colors duration-500 ${theme.panel}`}>
              <div />
              <ControlButton theme={theme} onAction={() => changeDirection({ x: 0, y: -1 })} aria-label="Up">
                <ChevronUp size={36} strokeWidth={3} />
              </ControlButton>
              <div />
              <ControlButton theme={theme} onAction={() => changeDirection({ x: -1, y: 0 })} aria-label="Left">
                <ChevronLeft size={36} strokeWidth={3} />
              </ControlButton>
              <ControlButton theme={theme} onAction={() => changeDirection({ x: 0, y: 1 })} aria-label="Down">
                <ChevronDown size={36} strokeWidth={3} />
              </ControlButton>
              <ControlButton theme={theme} onAction={() => changeDirection({ x: 1, y: 0 })} aria-label="Right">
                <ChevronRight size={36} strokeWidth={3} />
              </ControlButton>
            </div>
          </div>

        </div>

        {/* Right: Scoreboard Sidebar */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-4 max-w-[400px] px-1 sm:px-0 pb-4 sm:pb-0">
          <div className={`p-3 sm:p-5 rounded-2xl transition-colors duration-500 ${theme.panel}`}>
            <h2 className={`hidden sm:block text-lg sm:text-xl font-black mb-3 sm:mb-4 text-center tracking-tight transition-colors duration-500 ${theme.textHead}`}>{theme.title}</h2>
            <div className="grid grid-cols-5 md:grid-cols-2 gap-2 sm:gap-3">
              {bonusTypes.map((type: BonusType) => {
                const isEaten = eatenAnimals.includes(type);
                return (
                  <div 
                    key={type} 
                    className={`flex flex-col items-center justify-center p-2 sm:p-4 rounded-xl border-[3px] transition-all duration-300 ${
                      isEaten ? theme.bonusFnd : theme.bonusUnf
                    }`}
                  >
                    <div className="relative text-2xl sm:text-4xl mt-1">
                      <span className={`block transition-all duration-500 ${isEaten ? `opacity-50 grayscale blur-[1px] brightness-150` : 'scale-110'}`}>
                        {getBonusEmojis(themeIndex)[type]}
                      </span>
                      {isEaten && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`font-black text-base sm:text-xl tracking-tighter ${theme.textMuted}`} style={{textShadow: '0px 0px 4px rgba(0,0,0,0.5)'}}>X_X</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`p-3 sm:p-4 rounded-2xl transition-colors duration-500 flex justify-center ${theme.panel}`}>
            <label className="flex items-center gap-3 cursor-pointer touch-manipulation group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={isEndlessMode}
                  onChange={(e) => setIsEndlessMode(e.target.checked)}
                />
                <div className={`block w-10 h-6 sm:w-12 sm:h-7 rounded-full transition-colors duration-300 ${isEndlessMode ? 'bg-[#FF0055]' : 'bg-white/70 shadow-inner'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 sm:w-5 sm:h-5 rounded-full shadow transition-transform duration-300 ${isEndlessMode ? 'translate-x-4 sm:translate-x-5' : ''}`}></div>
              </div>
              <span className={`text-sm sm:text-base font-bold transition-colors duration-500 select-none ${theme.textHead}`}>
                <span className="hidden sm:inline">Endless Mode</span>
                <span className="sm:hidden">Endless</span>
              </span>
            </label>
          </div>

        </div>
        {/* End of Sidebar */}

      </div>
    </div>
  );
}

function ControlButton({ theme, children, onAction, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { onAction: () => void, theme: any }) {
  const handleAction = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onAction();
  };

  return (
    <button
      className={`w-16 h-16 flex items-center justify-center rounded-2xl active:translate-y-1 transition-all focus:outline-none touch-manipulation ${theme.button}`}
      onPointerDown={handleAction}
      {...props}
    >
      {children}
    </button>
  );
}
