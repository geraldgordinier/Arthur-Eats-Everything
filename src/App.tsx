import React, { useEffect, useCallback } from 'react';
import { useSnakeLogic, BonusType } from './hooks/useSnakeLogic';
import { SnakeCanvas } from './components/SnakeCanvas';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Play, RotateCcw, Pause, Trophy, Star } from 'lucide-react';

const BONUS_EMOJIS: Record<BonusType, string> = {
  cow: '🐮',
  lion: '🦁',
  duck: '🦆',
  frog: '🐸',
  monkey: '🐵',
};

export default function App() {
  const {
    snake,
    direction,
    food,
    bonus,
    score,
    gameOver,
    hasWon,
    isJerryLevel,
    eatenAnimals,
    isPaused,
    hasStarted,
    gridSize,
    bonusTypes,
    changeDirection,
    resetGame,
    setIsPaused,
    setHasStarted
  } = useSnakeLogic();

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
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection, hasStarted, gameOver, hasWon, resetGame, setIsPaused, setHasStarted]);

  return (
    <div className="min-h-screen w-full bg-orange-100 flex flex-col items-center justify-center p-2 sm:p-4 font-sans touch-none overflow-auto">
      <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-center md:items-start w-full max-w-3xl justify-center pt-8 pb-8 md:py-0">
        
        <div className="w-full max-w-[400px] flex flex-col gap-4 shrink-0">
          
          {/* Header */}
          <div className="flex items-center justify-between bg-white/60 p-4 rounded-2xl shadow-sm border border-orange-200">
            <div>
              <h1 className="text-3xl font-extrabold text-orange-800 tracking-tight">Arthur</h1>
              <p className="text-orange-600 text-sm font-medium leading-none mt-1">The Very Hungry Dog</p>
            </div>
            <div className="text-right flex flex-col items-end">
              <div className="flex items-center gap-1.5 text-orange-900 bg-orange-200/50 px-3 py-1.5 rounded-lg border border-orange-300 shadow-inner">
                <Trophy size={18} className="text-orange-600" />
                <span className="text-xl font-black">{score}</span>
              </div>
            </div>
          </div>

          {/* Game Area */}
          <div className="relative w-full aspect-square">
            <SnakeCanvas
              snake={snake}
              direction={direction}
              food={food}
              bonus={bonus}
              gridSize={gridSize}
              gameOver={gameOver}
              isJerryLevel={isJerryLevel}
            />
            
            {/* Overlays */}
            {(!hasStarted || gameOver || hasWon || isPaused) && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center p-6 z-10 overflow-hidden">
                <div className="bg-white rounded-2xl p-6 shadow-2xl text-center max-w-[90%] border-4 border-orange-200 flex flex-col items-center animate-in zoom-in duration-200">
                  {!hasStarted ? (
                    <>
                      <h2 className="text-2xl font-bold mb-2 text-orange-800">Ready to play?</h2>
                      <p className="text-gray-600 mb-6 text-sm">Help Arthur eat his green tires and chew up all 5 of his favorite stuffed animals! He's blind in one eye but he's very hungry.</p>
                      <button 
                        onClick={() => setHasStarted(true)}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg active:scale-95 transition-all text-lg flex items-center gap-2"
                      >
                        <Play fill="currentColor" size={20}/> Play Now
                      </button>
                    </>
                  ) : gameOver && !hasWon ? (
                    <>
                      <h2 className="text-3xl font-black mb-2 text-red-600">Woof!</h2>
                      <p className="text-gray-700 mb-6 font-medium">Arthur bumped into something.<br/>Final Score: {score}</p>
                      <button 
                        onClick={resetGame}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg active:scale-95 transition-all text-lg flex items-center gap-2"
                      >
                        <RotateCcw size={20}/> Try Again
                      </button>
                    </>
                  ) : hasWon ? (
                    <>
                      <h2 className="text-3xl font-black mb-2 text-green-600">You Win!</h2>
                      <p className="text-gray-700 mb-6 font-medium">Arthur ate Jerry! He is full now.<br/>Final Score: {score}</p>
                      <button 
                        onClick={resetGame}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg active:scale-95 transition-all text-lg flex items-center gap-2"
                      >
                        <Star fill="currentColor" size={20}/> Play Again
                      </button>
                    </>
                  ) : isPaused ? (
                    <>
                      <h2 className="text-2xl font-bold mb-6 text-orange-800">Paused</h2>
                      <button 
                        onClick={() => setIsPaused(false)}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg active:scale-95 transition-all text-lg flex items-center gap-2"
                      >
                        <Play fill="currentColor" size={20}/> Resume
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-2 mt-2 select-none">
            {/* Pause Button for mobile */}
            <div className="w-full flex justify-end px-2">
               <button 
                  className="bg-white/50 p-3 rounded-full text-orange-800 hover:bg-white/80 active:scale-95 transition-colors"
                  onClick={() => setIsPaused(p => !p)}
                  disabled={!hasStarted || gameOver}
               >
                  {isPaused ? <Play size={24} /> : <Pause size={24} />}
               </button>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 bg-orange-200/50 rounded-full border border-orange-200/80 shadow-inner w-fit mx-auto aspect-[3/2.2]">
              <div />
              <ControlButton onAction={() => changeDirection({ x: 0, y: -1 })} aria-label="Up">
                <ChevronUp size={36} strokeWidth={3} />
              </ControlButton>
              <div />
              <ControlButton onAction={() => changeDirection({ x: -1, y: 0 })} aria-label="Left">
                <ChevronLeft size={36} strokeWidth={3} />
              </ControlButton>
              <ControlButton onAction={() => changeDirection({ x: 0, y: 1 })} aria-label="Down">
                <ChevronDown size={36} strokeWidth={3} />
              </ControlButton>
              <ControlButton onAction={() => changeDirection({ x: 1, y: 0 })} aria-label="Right">
                <ChevronRight size={36} strokeWidth={3} />
              </ControlButton>
            </div>
          </div>

        </div>

        {/* Right: Scoreboard Sidebar */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-4 max-w-[400px]">
          <div className="bg-white/60 p-5 rounded-2xl shadow-sm border border-orange-200">
            <h2 className="text-xl font-black text-orange-800 mb-4 text-center tracking-tight">Stuffed Animals</h2>
            <div className="grid grid-cols-5 md:grid-cols-2 gap-3">
              {bonusTypes.map((type: BonusType) => {
                const isEaten = eatenAnimals.includes(type);
                return (
                  <div 
                    key={type} 
                    className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 ${
                      isEaten 
                        ? 'bg-orange-100 border-orange-300 shadow-inner' 
                        : 'bg-white border-dashed border-gray-300 shadow-sm'
                    }`}
                  >
                    <div className="relative text-3xl sm:text-4xl mt-1">
                      <span className={`block transition-all duration-500 ${isEaten ? 'opacity-30 grayscale blur-[1px]' : 'scale-110'}`}>
                        {BONUS_EMOJIS[type]}
                      </span>
                      {isEaten && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-red-600 font-black text-lg sm:text-xl tracking-tighter" style={{textShadow: '0px 0px 4px white, 0px 0px 8px white'}}>X_X</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* End of Sidebar */}

      </div>
    </div>
  );
}

function ControlButton({ children, onAction, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { onAction: () => void }) {
  const handleAction = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onAction();
  };

  return (
    <button
      className="w-16 h-16 bg-white flex items-center justify-center rounded-full shadow-[0_4px_0_theme(colors.orange.300)] active:shadow-none active:translate-y-1 text-orange-700 hover:bg-orange-50 transition-all focus:outline-none focus:ring-2 focus:ring-orange-400 touch-manipulation"
      onPointerDown={handleAction}
      {...props}
    >
      {children}
    </button>
  );
}
