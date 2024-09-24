import React from "react";
import { ExerciseComponent } from "./ExerciseComponentNoDnD";
import type { Exercise, Workout } from "~/server/db/types";

interface WorkoutData extends Omit<Workout, "exercises"> {
  exercises: (Exercise & {
    sets: { weight: number; reps: number; isNewSet: boolean }[];
  })[];
}

interface WorkoutExerciseListNoDnDProps {
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
  onStopwatchStart: (
    exerciseId: number,
    setIndex: number,
    exerciseName: string,
  ) => void;
}

const formatTime = (milliseconds: number | undefined) => {
  if (!milliseconds) return undefined;
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const WorkoutExerciseListNoDnD: React.FC<
  WorkoutExerciseListNoDnDProps
> = ({
  workout,
  completedSets,
  onUpdateSet,
  onAddSet,
  onSetComplete,
  onStopwatchStart,
}) => {
  return (
    <div className="m-auto flex w-full flex-col items-center justify-center md:max-w-[500px]">
      <div className="w-full space-y-4">
        {workout.exercises.map((exercise) => (
          <ExerciseComponent
            key={exercise.id}
            exercise={exercise}
            onUpdateSet={onUpdateSet}
            onAddSet={onAddSet}
            onStopwatchStart={onStopwatchStart}
            formatTime={formatTime}
            isSetCompleted={(exerciseId, setIndex) =>
              completedSets[exerciseId]?.[setIndex] ?? false
            }
            onSetComplete={onSetComplete}
          />
        ))}
      </div>
    </div>
  );
};
