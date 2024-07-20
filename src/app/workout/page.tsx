"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import MainNav from "~/components/navigation/MainNav";
import { Button } from "~/components/ui/button";
import type {
  ExerciseDb,
  SettingsDb,
  Workout as WorkoutType,
} from "~/server/db/types";
import { handleGenerateRoutine } from "./actions";
import "~/utils/string-extensions";
import Set from "./Set";
import { getSettings } from "../settings/actions";
import FinishWorkout from "./FinishWorkout";
import CancelWorkout from "./CancelWorkout";

export default function Workout() {
  const [routine, setRoutine] = useState<ExerciseDb[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [numberOfSets, setNumberOfSets] = useState<number>(0);
  const [workout, setWorkout] = useState<WorkoutType | null>(null);

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const routine = await handleGenerateRoutine();
        setRoutine(routine);

        const settingsArray: SettingsDb[] = await getSettings();
        const settings: SettingsDb | undefined = settingsArray[0];
        if (!settings) return;
        setNumberOfSets(settings.sets);

        // Initialize workout
        setWorkout({
          id: undefined,
          user_id: "", // You'll need to set this with the actual user ID
          exercises: routine.map((exercise) => ({
            id: exercise.id!,
            sets: Array(settings.sets).fill({ weight: 0, reps: 0 }),
          })),
          created_date: undefined,
          updated_date: undefined,
        });
      } catch (error) {
        console.error("Error generating routine:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchRoutine();
  }, []);

  const updateSet = (
    exerciseId: number,
    setIndex: number,
    weight: number,
    reps: number,
  ) => {
    setWorkout((prevWorkout) => {
      if (!prevWorkout) return null;
      return {
        ...prevWorkout,
        exercises: prevWorkout.exercises.map((exercise) =>
          exercise.id === exerciseId
            ? {
                ...exercise,
                sets: exercise.sets.map((set, i) =>
                  i === setIndex ? { weight, reps } : set,
                ),
              }
            : exercise,
        ),
      };
    });
  };

  return (
    <>
      <MainNav />
      <main className="flex flex-col items-center justify-center gap-8 bg-background p-5 text-foreground">
        <h1 className="text-4xl">Workout</h1>
        <div className="m-auto flex w-full flex-col items-center justify-center md:max-w-[500px]">
          {isLoading ? (
            <div className="flex flex-row gap-2">
              <Loader2 className="animate-spin" /> Loading routine...
            </div>
          ) : (
            routine.map((exercise, exerciseIndex) => (
              <div
                key={exercise.id}
                className="mb-4 flex flex-col gap-3 rounded-xl bg-foreground/10 px-4 py-3"
              >
                <h2 className="flex items-center gap-2 text-2xl font-bold">
                  {exercise.name.titleCase()}
                  {exercise.variant ? `, ${exercise.variant}` : ""}
                </h2>
                <div className="-mt-3 text-xs">
                  {exercise.body_part}{" "}
                  {exercise.type ? `- ${exercise.type}` : ``}
                </div>
                <div>
                  <div className="mb-2 grid grid-cols-7 items-center justify-center space-x-2 text-sm">
                    <div className="col-span-1 text-center">SET</div>
                    <div className="col-span-1 text-center">PREV.</div>
                    <div className="col-span-2 text-center">+WEIGHT</div>
                    <div className="col-span-2 text-center">REPS</div>
                    <div className="col-span-1 text-center text-lg">✓</div>
                  </div>
                  {Array.from({ length: numberOfSets }, (_, setIndex) => (
                    <Set
                      key={setIndex}
                      exerciseId={exercise.id}
                      setNumber={setIndex + 1}
                      onUpdate={(weight, reps) =>
                        updateSet(exercise.id!, setIndex, weight, reps)
                      }
                    />
                  ))}
                </div>
                <Button
                  variant={"ghost"}
                  className="w-full font-bold text-primary/80"
                >
                  Add set
                </Button>
              </div>
            ))
          )}
        </div>
        <div className="flex gap-5">
          <CancelWorkout />
          {workout && <FinishWorkout workout={workout} />}
        </div>
      </main>
    </>
  );
}
