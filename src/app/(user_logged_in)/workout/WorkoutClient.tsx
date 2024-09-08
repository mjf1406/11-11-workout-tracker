"use client";

import React, { useCallback, useState } from "react";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchExercises,
  fetchSettings,
  fetchWorkouts,
} from "~/app/api/fetchers";
import { useWorkoutState } from "./hooks/useWorkoutState";
import { useRestTimer } from "./hooks/useRestTimer";
import { useStopwatch } from "./hooks/useStopwatch";
import { WorkoutExerciseList } from "./components/WorkoutExerciseList";
import { WorkoutControls } from "./components/WorkoutControls";
import { RestTimerDrawer } from "./components/RestTimerDrawer";
import { StopwatchDrawer } from "./components/StopwatchDrawer";
import { toast } from "~/components/ui/use-toast";
import type { FilteredWorkoutData } from "~/server/db/types";

export default function WorkoutClient() {
  const [isRestDrawerOpen, setIsRestDrawerOpen] = useState(false);
  const [activeExerciseName, setActiveExerciseName] = useState("");

  const { data: settings, isLoading: isSettingsLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  const { data: exercises, isLoading: isExercisesLoading } = useQuery({
    queryKey: ["exercises"],
    queryFn: fetchExercises,
  });

  const { data: workouts, isLoading: isWorkoutsLoading } = useQuery({
    queryKey: ["workouts"],
    queryFn: fetchWorkouts,
  });

  const {
    workout,
    completedSets,
    handleUpdateSet,
    handleAddSet,
    handleSetComplete,
    generateWorkoutRoutine,
  } = useWorkoutState(settings, exercises, workouts);

  const {
    isResting,
    restTimer,
    startRestTimer,
    adjustRestTimer,
    skipRestTimer,
  } = useRestTimer(settings?.rest_duration);

  const {
    stopwatchTime,
    isRunning: isStopwatchRunning,
    startStopwatch,
    stopStopwatch,
  } = useStopwatch();

  React.useEffect(() => {
    if (settings && exercises && workouts) {
      void generateWorkoutRoutine();
    }
  }, [settings, exercises, workouts, generateWorkoutRoutine]);

  const handleStopwatchStart = useCallback(
    (exerciseId: number, setIndex: number, exerciseName: string) => {
      setActiveExerciseName(exerciseName);
      startStopwatch();
    },
    [startStopwatch],
  );

  const handleStopwatchStop = useCallback(() => {
    stopStopwatch();
    // Here you can add any additional logic needed when the stopwatch stops
  }, [stopStopwatch]);

  const handleStopwatchClose = useCallback(() => {
    // Reset stopwatch state without updating the set
    stopStopwatch();
    setActiveExerciseName("");
  }, [stopStopwatch]);

  const handleSetCompleteWithRest = useCallback(
    (exerciseId: number, setIndex: number, isCompleted: boolean) => {
      handleSetComplete(exerciseId, setIndex, isCompleted);

      if (isCompleted && workout) {
        const exerciseIndex = workout.exercises.findIndex(
          (e) => e.id === exerciseId,
        );
        const isLastExercise = exerciseIndex === workout.exercises.length - 1;
        const exercise = workout.exercises[exerciseIndex];

        const isLastSet = setIndex === (exercise?.sets?.length ?? 0) - 1;

        if (isLastExercise && !isLastSet) {
          startRestTimer();
          setIsRestDrawerOpen(true);
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

  if (
    isSettingsLoading ||
    isExercisesLoading ||
    isWorkoutsLoading ||
    !workout
  ) {
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
        isOpen={isRestDrawerOpen}
        onOpenChange={setIsRestDrawerOpen}
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
