// hooks/useWorkoutState.ts
import { useState, useCallback } from 'react';
import { generateRoutine } from "~/utils/genWorkoutHelpers";
import type { Exercise, Workout, WorkoutsResponse, SettingsResponse, ExercisesResponse } from "~/server/db/types";

interface ExerciseWithSets extends Exercise {
  sets: { weight: number; reps: number; isNewSet: boolean }[];
}

export interface WorkoutData extends Omit<Workout, "exercises"> {
  exercises: ExerciseWithSets[];
}

export const useWorkoutState = (
  settings: SettingsResponse | undefined,
  exercises: ExercisesResponse | undefined,
  workouts: WorkoutsResponse | undefined
) => {
  const [workout, setWorkout] = useState<WorkoutData | null>(null);
  const [completedSets, setCompletedSets] = useState<Record<number, boolean[]>>({});

  const getPreviousExerciseSetDataById = useCallback(
    (id: number): { weight: number; reps: number }[] => {
      if (!workouts || workouts?.length === 0) return [];
      
      for (let i = workouts.length - 1; i >= 0; i--) {
        if (!workouts) continue
        const workout = workouts[i];
        const exercise = workout?.exercises.find((e) => e.id === id) as ExerciseWithSets | undefined;
        if (exercise?.sets && exercise.sets.length > 0) {
          return exercise.sets.map(set => ({
            weight: set.weight ?? 0,
            reps: set.reps ?? 0
          }));
        }
      }

      return [];
    },
    [workouts]
  );

  const generateWorkoutRoutine = useCallback(async () => {
    if (settings && exercises) {
      const generatedRoutine = await generateRoutine(settings, exercises);

      const newWorkout: WorkoutData = {
        id: 0,
        user_id: "",
        exercises: generatedRoutine.map((exercise) => {
          const previousSets = getPreviousExerciseSetDataById(exercise.id);

          const newSets: { weight: number; reps: number; isNewSet: boolean }[] = [];

          for (let i = 0; i < (settings.sets ?? 0); i++) {
            if (i < previousSets.length) {
              newSets.push({
                weight: previousSets[i]?.weight ?? 0,
                reps: previousSets[i]?.reps ?? 0,
                isNewSet: false
              });
            } else {
              const lastSet = newSets[newSets.length - 1] ?? { weight: 0, reps: 0 };
              newSets.push({ ...lastSet, isNewSet: true });
            }
          }

          return {
            ...exercise,
            sets: newSets,
          };
        }),
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      };

      setWorkout(newWorkout);
      setCompletedSets(
        newWorkout.exercises.reduce<Record<number, boolean[]>>(
          (acc, exercise) => {
            acc[exercise.id] = Array.from<boolean>({ length: exercise.sets.length }).fill(false);
            return acc;
          },
          {}
        )
      );
    }
  }, [settings, exercises, getPreviousExerciseSetDataById]);

  const handleUpdateSet = useCallback(
    (exerciseId: number, setIndex: number, updateData: { weight?: number; reps?: number }) => {
      setWorkout((prevWorkout) => {
        if (!prevWorkout) return null;
        return {
          ...prevWorkout,
          exercises: prevWorkout.exercises.map((exercise) =>
            exercise.id === exerciseId
              ? {
                  ...exercise,
                  sets: exercise.sets.map((set, i) =>
                    i === setIndex ? { ...set, ...updateData } : set
                  ),
                }
              : exercise
          ),
        };
      });
    },
    []
  );

  const handleAddSet = useCallback(
    (exerciseId: number) => {
      setWorkout((prevWorkout) => {
        if (!prevWorkout) return null;
        return {
          ...prevWorkout,
          exercises: prevWorkout.exercises.map((exercise) =>
            exercise.id === exerciseId
              ? {
                  ...exercise,
                  sets: [...exercise.sets, { weight: 0, reps: 0, isNewSet: true }],
                }
              : exercise
          ),
        };
      });
      setCompletedSets((prev) => ({
        ...prev,
        [exerciseId]: [...(prev[exerciseId] ?? []), false],
      }));
    },
    []
  );

  const handleSetComplete = useCallback(
    (exerciseId: number, setIndex: number, isCompleted: boolean) => {
      setCompletedSets((prev) => {
        const exerciseSets = prev[exerciseId] ?? [];
        const updatedSets = [...exerciseSets];
        updatedSets[setIndex] = isCompleted;
        return {
          ...prev,
          [exerciseId]: updatedSets,
        };
      });
    },
    []
  );

  return {
    workout,
    completedSets,
    generateWorkoutRoutine,
    handleUpdateSet,
    handleAddSet,
    handleSetComplete,
  };
};