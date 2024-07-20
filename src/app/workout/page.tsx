"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import MainNav from "~/components/navigation/MainNav";
import { Button } from "~/components/ui/button";
import type { ExerciseDb } from "~/server/db/types";
import WorkoutActions from "./WorkoutActions";
import { handleGenerateRoutine } from "./actions";
import "~/utils/string-extensions";

export default function Workout() {
  const [routine, setRoutine] = useState<ExerciseDb[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const routine = await handleGenerateRoutine();
        console.log("🚀 ~ fetchRoutine ~ routine:", routine);
        setRoutine(routine);
      } catch (error) {
        console.error("Error generating routine:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchRoutine();
  }, []);

  return (
    <>
      <MainNav />
      <main className="flex flex-col items-center justify-center gap-8 bg-background p-5 text-foreground">
        <h1 className="text-4xl">Workout</h1>
        <WorkoutActions />
        <div>
          {isLoading ? (
            <div className="flex flex-row gap-2">
              {" "}
              <Loader2 className="animate-spin" /> Loading routine...
            </div>
          ) : (
            routine.map((exercise, index) => (
              <div
                key={exercise.id}
                className="mb-4 flex flex-col gap-3 rounded-xl bg-foreground/10 px-4 py-3"
              >
                <h2 className="flex items-center gap-2 text-2xl font-bold">
                  {index + 1}.) {exercise.name.titleCase()}{" "}
                  <span className="text-sm">
                    {exercise.variant ? `(${exercise.variant})` : ""}
                  </span>
                </h2>
                <Button variant={"ghost"} className="w-full">
                  Add set
                </Button>
              </div>
            ))
          )}
        </div>
        <WorkoutActions />
      </main>
    </>
  );
}
