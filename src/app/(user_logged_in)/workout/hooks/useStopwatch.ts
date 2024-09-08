// hooks/useStopwatch.ts
import { useState, useRef, useEffect } from 'react';

export const useStopwatch = () => {
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const stopwatchRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      stopwatchRef.current = setInterval(() => {
        setStopwatchTime((prev) => prev + 100);
      }, 100);
    } else {
      if (stopwatchRef.current) {
        clearInterval(stopwatchRef.current);
      }
    }

    return () => {
      if (stopwatchRef.current) {
        clearInterval(stopwatchRef.current);
      }
    };
  }, [isRunning]);

  const startStopwatch = () => {
    setIsRunning(true);
  };

  const stopStopwatch = () => {
    setIsRunning(false);
    setStopwatchTime(0);
  };

  return {
    stopwatchTime,
    isRunning,
    startStopwatch,
    stopStopwatch,
  };
};