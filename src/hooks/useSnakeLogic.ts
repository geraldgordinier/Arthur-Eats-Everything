import { useState, useEffect, useCallback, useRef } from 'react';
import { playSound } from '../lib/audio';

export type Point = { x: number; y: number };
export type BonusType = 'cow' | 'lion' | 'duck' | 'frog' | 'monkey';
export type Bonus = Point & { type: BonusType };

const GRID_SIZE = 20;
const INITIAL_SPEED = 160; // ms per tick
const SPEED_CAP = 60; // fastest speed
const SPEED_DECREMENT = 3; // speed decreases (gets faster) by this much per treat

const randomPoint = (): Point => ({
  x: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1,
  y: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1,
});

const BONUS_TYPES: BonusType[] = ['cow', 'lion', 'duck', 'frog', 'monkey'];

export function useSnakeLogic() {
  const [snake, setSnake] = useState<Point[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ]);
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [nextDirection, setNextDirection] = useState<Point>({ x: 0, y: -1 });
  const [food, setFood] = useState<Point>({ x: 10, y: 5 });
  const [bonus, setBonus] = useState<Bonus | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const [eatenAnimals, setEatenAnimals] = useState<BonusType[]>([]);
  const [hasWon, setHasWon] = useState(false);
  const [isJerryLevel, setIsJerryLevel] = useState(false);
  const treatsEaten = useRef(0);

  const resetGame = useCallback(() => {
    setSnake([
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ]);
    setDirection({ x: 0, y: -1 });
    setNextDirection({ x: 0, y: -1 });
    setFood({ x: 10, y: 5 });
    setBonus(null);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setHasStarted(true);
    setSpeed(INITIAL_SPEED);
    setEatenAnimals([]);
    setHasWon(false);
    setIsJerryLevel(false);
    treatsEaten.current = 0;
  }, []);

  const changeDirection = useCallback(
    (newDir: Point) => {
      // Prevent reversing into oneself
      if (
        hasStarted &&
        !isPaused &&
        !gameOver &&
        !hasWon &&
        ((newDir.x !== 0 && direction.x === 0) || (newDir.y !== 0 && direction.y === 0))
      ) {
        setNextDirection(newDir);
      }
    },
    [direction, hasStarted, isPaused, gameOver, hasWon]
  );

  const tick = useCallback(() => {
    if (gameOver || hasWon || isPaused || !hasStarted) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + nextDirection.x,
        y: head.y + nextDirection.y,
      };

      // Wall collision (looping around or crashing?)
      // Let's make walls fatal for an extra challenge.
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        playSound('die');
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        playSound('die');
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];
      let ate = false;

      let currentFood = food;

      // Jerry movement
      if (isJerryLevel && Math.random() < 0.25) {
        const moves = [ {x:0, y:1}, {x:0, y:-1}, {x:1, y:0}, {x:-1, y:0} ];
        const validMoves = moves.map(m => ({x: food.x + m.x, y: food.y + m.y}))
          .filter(p => p.x >= 0 && p.x < GRID_SIZE && p.y >= 0 && p.y < GRID_SIZE)
          .filter(p => !newSnake.some(s => s.x === p.x && s.y === p.y))
          .filter(p => !(p.x === newHead.x && p.y === newHead.y)); // Don't jump into head
        
        if (validMoves.length > 0) {
          currentFood = validMoves[Math.floor(Math.random() * validMoves.length)];
          setFood(currentFood);
        }
      }

      // Check regular food / Jerry
      if (newHead.x === currentFood.x && newHead.y === currentFood.y) {
        ate = true;
        playSound('eat');
        
        if (isJerryLevel) {
          setScore((s) => s + 500);
          setHasWon(true);
          return prevSnake; // Game over, keep old snake but we won!
        } else {
          setScore((s) => s + 10);
          setSpeed((s) => Math.max(SPEED_CAP, s - SPEED_DECREMENT));
          
          let newFood = randomPoint();
          while (newSnake.some((s) => s.x === newFood.x && s.y === newFood.y)) {
            newFood = randomPoint();
          }
          setFood(newFood);

          treatsEaten.current += 1;
          // Spawn bonus every 2 treats if none exists
          if (!bonus && treatsEaten.current % 2 === 0) {
            setEatenAnimals((currentEaten) => {
              const remaining = BONUS_TYPES.filter(t => !currentEaten.includes(t));
              if (remaining.length > 0) {
                const randomType = remaining[Math.floor(Math.random() * remaining.length)];
                let newBonusObjId = randomPoint();
                while (
                  newSnake.some((s) => s.x === newBonusObjId.x && s.y === newBonusObjId.y) ||
                  (newBonusObjId.x === newFood.x && newBonusObjId.y === newFood.y)
                ) {
                  newBonusObjId = randomPoint();
                }
                setBonus({ ...newBonusObjId, type: randomType });
              }
              return currentEaten;
            });
          }
        }
      }

      // Check bonus food
      if (bonus && newHead.x === bonus.x && newHead.y === bonus.y) {
        ate = true;
        playSound('eat-bonus');
        setScore((s) => s + 50);
        setSpeed((s) => Math.max(SPEED_CAP, s - (SPEED_DECREMENT * 2)));
        
        setEatenAnimals((prev) => {
          if (!prev.includes(bonus.type)) {
            const newEaten = [...prev, bonus.type];
            if (newEaten.length === BONUS_TYPES.length) {
              // all animals eaten: enter Jerry level!
              setIsJerryLevel(true);
            }
            return newEaten;
          }
          return prev;
        });
        
        setBonus(null);
      }

      if (!ate) {
        newSnake.pop(); // Remove tail if we didn't eat
      }

      setDirection(nextDirection);
      return newSnake;
    });
  }, [direction, nextDirection, food, bonus, gameOver, hasWon, isPaused, hasStarted]);

  useEffect(() => {
    if (!hasStarted || gameOver || hasWon || isPaused) return;

    const intervalId = setInterval(tick, speed);
    return () => clearInterval(intervalId);
  }, [tick, speed, hasStarted, gameOver, hasWon, isPaused]);

  return {
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
    gridSize: GRID_SIZE,
    bonusTypes: BONUS_TYPES,
    changeDirection,
    resetGame,
    setIsPaused,
    setHasStarted
  };
}
