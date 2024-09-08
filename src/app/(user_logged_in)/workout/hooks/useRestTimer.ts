import { useState, useRef, useEffect, useCallback } from 'react';

export const useRestTimer = (initialDuration = 90000) => {
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(initialDuration);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
          if (newTime <= 0) {
            setIsResting(false);
            setIsDrawerOpen(false);
          }
          return newTime;
        });
      }, 100);
    } else if (restTimer === 0) {
      setIsResting(false);
      setIsDrawerOpen(false);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isResting, restTimer]);

  const startRestTimer = useCallback(() => {
    setIsResting(true);
    setRestTimer(initialDuration);
    setIsDrawerOpen(true);
  }, [initialDuration]);

  const adjustRestTimer = useCallback((milliseconds: number) => {
    setRestTimer((prev) => Math.max(0, prev + milliseconds));
  }, []);

  const skipRestTimer = useCallback(() => {
    setIsResting(false);
    setRestTimer(0);
    setIsDrawerOpen(false);
  }, []);

  const setDrawerOpen = useCallback((open: boolean) => {
    setIsDrawerOpen(open);
  }, []);

  return {
    isResting,
    restTimer,
    isDrawerOpen,
    startRestTimer,
    adjustRestTimer,
    skipRestTimer,
    setDrawerOpen,
  };
};