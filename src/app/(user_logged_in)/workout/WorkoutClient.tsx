"use client";

import React, { useCallback, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useWorkoutState } from "./hooks/useWorkoutState";
import { useStopwatch } from "./hooks/useStopwatch";
import { useRestTimer } from "./hooks/useRestTimer";
import { WorkoutExerciseList } from "./components/WorkoutExerciseList";
import { WorkoutControls } from "./components/WorkoutControls";
import { RestTimerDrawer } from "./components/RestTimerDrawer";
import { StopwatchDrawer } from "./components/StopwatchDrawer";
import { toast } from "~/components/ui/use-toast";
import type {
  FilteredWorkoutData,
  Settings,
  Exercise,
  Workout,
} from "~/server/db/types";

type WorkoutClientProps = {
  initialSettings: Settings;
  initialExercises: Exercise[];
  initialWorkouts: Workout[];
};

export default function WorkoutClient({
  initialSettings,
  initialExercises,
  initialWorkouts,
}: WorkoutClientProps) {
  const [activeExerciseName, setActiveExerciseName] = useState("");
  const [activeExerciseId, setActiveExerciseId] = useState<number | null>(null);
  const [activeSetIndex, setActiveSetIndex] = useState<number | null>(null);

  const {
    workout,
    completedSets,
    handleUpdateSet,
    handleAddSet,
    handleSetComplete,
    generateWorkoutRoutine,
  } = useWorkoutState(initialSettings, initialExercises, initialWorkouts);

  const {
    stopwatchTime,
    isRunning: isStopwatchRunning,
    startStopwatch,
    stopStopwatch,
  } = useStopwatch();

  const {
    isResting,
    restTimer,
    isDrawerOpen,
    startRestTimer,
    adjustRestTimer,
    skipRestTimer,
    setDrawerOpen,
  } = useRestTimer(initialSettings?.rest_duration);

  useEffect(() => {
    void generateWorkoutRoutine();
  }, [generateWorkoutRoutine]);

  const handleStopwatchStart = useCallback(
    (exerciseId: number, setIndex: number, exerciseName: string) => {
      setActiveExerciseName(exerciseName);
      setActiveExerciseId(exerciseId);
      setActiveSetIndex(setIndex);
      startStopwatch();
    },
    [startStopwatch],
  );

  const handleStopwatchStop = useCallback(() => {
    if (activeExerciseId !== null && activeSetIndex !== null) {
      handleUpdateSet(activeExerciseId, activeSetIndex, {
        reps: stopwatchTime,
      });
    }
    stopStopwatch();
    setActiveExerciseName("");
    setActiveExerciseId(null);
    setActiveSetIndex(null);
  }, [
    activeExerciseId,
    activeSetIndex,
    handleUpdateSet,
    stopStopwatch,
    stopwatchTime,
  ]);

  const handleStopwatchClose = useCallback(() => {
    stopStopwatch();
    setActiveExerciseName("");
    setActiveExerciseId(null);
    setActiveSetIndex(null);
  }, [stopStopwatch]);

  const handleSetCompleteWithRest = useCallback(
    (exerciseId: number, setIndex: number, isCompleted: boolean) => {
      handleSetComplete(exerciseId, setIndex, isCompleted);

      if (isCompleted && workout) {
        const exerciseIndex = workout.exercises.findIndex(
          (e) => e.id === exerciseId,
        );
        const currentExercise = workout.exercises[exerciseIndex];

        if (currentExercise) {
          const isLastExercise = exerciseIndex === workout.exercises.length - 1;
          const isLastSet = setIndex === currentExercise.sets.length - 1;

          if (isLastExercise && !isLastSet) {
            startRestTimer();
          }
        }
      }
    },
    [handleSetComplete, workout, startRestTimer],
  );

  const handleFinishWorkout = async (): Promise<FilteredWorkoutData | null> => {
    if (workout) {
      const hasCompletedSets = Object.values(completedSets).some((setArray) =>
        setArray.some(Boolean),
      );

      if (!hasCompletedSets) {
        toast({
          title: "No completed sets",
          description:
            "Please complete at least one set before finishing the workout.",
          variant: "destructive",
        });
        return null;
      }

      const filteredWorkout = {
        exercises: workout.exercises.map((exercise) => ({
          id: exercise.id,
          sets: exercise.sets,
        })),
      };

      return filteredWorkout;
    }
    return null;
  };

  if (!workout) {
    return (
      <div className="flex h-96 w-full items-start justify-center">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <span>Loading workout...</span>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center gap-8 p-5 pb-20 text-foreground">
      <WorkoutExerciseList
        workout={workout}
        completedSets={completedSets}
        onUpdateSet={handleUpdateSet}
        onAddSet={handleAddSet}
        onSetComplete={handleSetCompleteWithRest}
        onStopwatchStart={handleStopwatchStart}
      />
      <WorkoutControls onFinishWorkout={handleFinishWorkout} />
      <RestTimerDrawer
        isResting={isResting}
        isOpen={isDrawerOpen}
        onOpenChange={setDrawerOpen}
        restTimer={restTimer}
        onAdjustRest={adjustRestTimer}
        onSkipRest={skipRestTimer}
      />
      <StopwatchDrawer
        isRunning={isStopwatchRunning}
        time={stopwatchTime}
        onStop={handleStopwatchStop}
        onClose={handleStopwatchClose}
        exerciseName={activeExerciseName}
      />
    </main>
  );
}
