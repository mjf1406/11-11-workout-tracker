// hooks/useRestTimer.ts
import { useState, useRef, useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export const useRestTimer = (initialDuration: number = 90000) => {
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(initialDuration);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timerPop = new Audio(
      "https://utfs.io/f/996d6ea5-8313-4d9e-8826-5e4bbf7cbb81-vwnkn.ogg"
    );
    const timerEnd = new Audio(
      "https://utfs.io/f/23579237-c9ce-4d4f-bb2f-528d9a93b773-vwfdt.ogg"
    );

    if (isResting && restTimer > 0) {
      timerRef.current = setInterval(() => {
        setRestTimer((prev) => {
          const newTime = Math.max(0, prev - 100);
          if ([4000, 3000, 2000].includes(newTime)) {
            void timerPop.play();
          }
          if (newTime === 1000) {
            void timerEnd.play();
          }
          return newTime;
        });
      }, 100);
    } else if (restTimer === 0) {
      setIsResting(false);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isResting, restTimer]);

  const startRestTimer = () => {
    setIsResting(true);
    setRestTimer(initialDuration);
  };

  const adjustRestTimer = (milliseconds: number) => {
    setRestTimer((prev) => Math.max(0, prev + milliseconds));
  };

  const skipRestTimer = () => {
    setIsResting(false);
    setRestTimer(0);
  };

  return {
    isResting,
    restTimer,
    startRestTimer,
    adjustRestTimer,
    skipRestTimer,
  };
};