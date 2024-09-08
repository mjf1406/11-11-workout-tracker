import React, { useState, useEffect } from "react";
import { ExerciseComponent } from "./Exercise";
import { StopwatchDrawer } from "./StopwatchDrawer";
import type { Exercise, Workout } from "~/server/db/types";

interface WorkoutData extends Omit<Workout, "exercises"> {
  exercises: (Exercise & {
    sets: { weight: number; reps: number; isNewSet: boolean }[];
  })[];
}

interface WorkoutExerciseListProps {
  workout: WorkoutData;
  completedSets: Record<number, boolean[]>;
  onUpdateSet: (
    exerciseId: number,
    setIndex: number,
    updateData: { weight?: number; reps?: number },
  ) => void;
  onAddSet: (exerciseId: number) => void;
  onSetComplete: (
    exerciseId: number,
    setIndex: number,
    isCompleted: boolean,
  ) => void;
}

export const WorkoutExerciseList: React.FC<WorkoutExerciseListProps> = ({
  workout,
  completedSets,
  onUpdateSet,
  onAddSet,
  onSetComplete,
}) => {
  const [stopwatchState, setStopwatchState] = useState<{
    isRunning: boolean;
    exerciseId: number | null;
    setIndex: number | null;
    exerciseName: string;
    startTime: number | null;
    currentTime: number;
  }>({
    isRunning: false,
    exerciseId: null,
    setIndex: null,
    exerciseName: "",
    startTime: null,
    currentTime: 0,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stopwatchState.isRunning && stopwatchState.startTime) {
      interval = setInterval(() => {
        setStopwatchState((prev) => ({
          ...prev,
          currentTime: Date.now() - prev.startTime!,
        }));
      }, 10);
    }
    return () => clearInterval(interval);
  }, [stopwatchState.isRunning, stopwatchState.startTime]);

  const formatTime = (milliseconds: number | undefined) => {
    if (!milliseconds) return undefined;
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleStopwatchStart = (
    exerciseId: number,
    setIndex: number,
    exerciseName: string,
  ) => {
    setStopwatchState({
      isRunning: true,
      exerciseId,
      setIndex,
      exerciseName,
      startTime: Date.now(),
      currentTime: 0,
    });
  };

  const handleStopwatchStop = () => {
    if (
      stopwatchState.exerciseId !== null &&
      stopwatchState.setIndex !== null
    ) {
      onUpdateSet(stopwatchState.exerciseId, stopwatchState.setIndex, {
        reps: stopwatchState.currentTime,
      });
    }
    setStopwatchState({
      isRunning: false,
      exerciseId: null,
      setIndex: null,
      exerciseName: "",
      startTime: null,
      currentTime: 0,
    });
  };

  const handleDrawerClose = () => {
    setStopwatchState({
      isRunning: false,
      exerciseId: null,
      setIndex: null,
      exerciseName: "",
      startTime: null,
      currentTime: 0,
    });
  };

  return (
    <div className="m-auto flex w-full flex-col items-center justify-center md:max-w-[500px]">
      <div className="w-full space-y-4">
        {workout.exercises.map((exercise) => (
          <ExerciseComponent
            key={exercise.id}
            exercise={exercise}
            onUpdateSet={onUpdateSet}
            onAddSet={onAddSet}
            onStopwatchStart={handleStopwatchStart}
            formatTime={formatTime}
            isSetCompleted={(exerciseId, setIndex) =>
              completedSets[exerciseId]?.[setIndex] ?? false
            }
            onSetComplete={onSetComplete}
          />
        ))}
      </div>
      <StopwatchDrawer
        isRunning={stopwatchState.isRunning}
        time={stopwatchState.currentTime}
        onStop={handleStopwatchStop}
        onClose={handleDrawerClose}
        exerciseName={stopwatchState.exerciseName}
      />
    </div>
  );
};
