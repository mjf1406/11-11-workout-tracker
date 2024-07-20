"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import MainNav from "~/components/navigation/MainNav";
import { Button } from "~/components/ui/button";
import type { Exercise, RoutineSettings } from "~/server/db/types";
import { generateRoutine } from "~/utils/genWorkoutHelpers";
import "~/utils/string-extensions";
import { MINUTE } from "~/lib/constants";
import WorkoutActions from "./WorkoutActions";

const exercises: Exercise[] = [
  {
    ID: 1,
    NAME: "pull-up",
    VARIANT: "standard",
    BODY_PART: "upper",
    TYPE: "pull",
  },
  {
    ID: 2,
    NAME: "push-up",
    VARIANT: "triangle",
    BODY_PART: "upper",
    TYPE: "push",
  },
  {
    ID: 3,
    NAME: "bulgarian split squat",
    VARIANT: "",
    BODY_PART: "lower",
    TYPE: "",
  },
  { ID: 4, NAME: "v-up", VARIANT: "", BODY_PART: "abs", TYPE: "" },
  { ID: 5, NAME: "pull-up", VARIANT: "wide", BODY_PART: "upper", TYPE: "pull" },
  {
    ID: 6,
    NAME: "push-up",
    VARIANT: "standard",
    BODY_PART: "upper",
    TYPE: "push",
  },
  {
    ID: 7,
    NAME: "deadlift",
    VARIANT: "single-leg",
    BODY_PART: "lower",
    TYPE: "",
  },
  {
    ID: 8,
    NAME: "heels to the heavens",
    VARIANT: "",
    BODY_PART: "abs",
    TYPE: "",
  },
  { ID: 9, NAME: "push-up", VARIANT: "wide", BODY_PART: "upper", TYPE: "push" },
  {
    ID: 10,
    NAME: "row",
    VARIANT: "inverted",
    BODY_PART: "upper",
    TYPE: "pull",
  },
  { ID: 11, NAME: "lunge", VARIANT: "standard", BODY_PART: "lower", TYPE: "" },
  { ID: 12, NAME: "scissors", VARIANT: "", BODY_PART: "abs", TYPE: "" },
  {
    ID: 13,
    NAME: "chin-up",
    VARIANT: "standard",
    BODY_PART: "upper",
    TYPE: "pull",
  },
  { ID: 14, NAME: "flat leg raise", VARIANT: "", BODY_PART: "abs", TYPE: "" },
  {
    ID: 15,
    NAME: "push-up",
    VARIANT: "pike",
    BODY_PART: "upper",
    TYPE: "push",
  },
  {
    ID: 16,
    NAME: "hanging leg raise",
    VARIANT: "",
    BODY_PART: "abs",
    TYPE: "",
  },
  {
    ID: 17,
    NAME: "chin-up",
    VARIANT: "wide",
    BODY_PART: "upper",
    TYPE: "pull",
  },
  {
    ID: 18,
    NAME: "push-up",
    VARIANT: "clap",
    BODY_PART: "upper",
    TYPE: "push",
  },
  {
    ID: 19,
    NAME: "push-up",
    VARIANT: "archer",
    BODY_PART: "upper",
    TYPE: "push",
  },
  { ID: 20, NAME: "deadlift", VARIANT: "sumo", BODY_PART: "lower", TYPE: "" },
  {
    ID: 21,
    NAME: "row",
    VARIANT: "inverted, face",
    BODY_PART: "upper",
    TYPE: "pull",
  },
  { ID: 22, NAME: "squat", VARIANT: "pistol", BODY_PART: "lower", TYPE: "" },
  { ID: 23, NAME: "lunge", VARIANT: "reverse", BODY_PART: "lower", TYPE: "" },
];

const routineSettings: RoutineSettings = {
  upperPull: 1,
  upperPush: 1,
  lower: 1,
  abs: 1,
  sets: 2,
  restDuration: 3 * MINUTE,
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Use a type assertion to tell TypeScript that these values are definitely of type T
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]] as [T, T];
  }
  return shuffled;
}

export default function Workout() {
  const [routine, setRoutine] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generatedRoutine = generateRoutine(routineSettings, exercises);
    const allExercises = [
      ...generatedRoutine.upperPull,
      ...generatedRoutine.upperPush,
      ...generatedRoutine.lower,
      ...generatedRoutine.abs,
    ];
    setRoutine(shuffleArray(allExercises));
    setIsLoading(false);
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
                key={exercise.ID}
                className="mb-4 flex flex-col gap-3 rounded-xl bg-foreground/10 px-4 py-3"
              >
                <h2 className="flex items-center gap-2 text-2xl font-bold">
                  {index + 1}.) {exercise.NAME.titleCase()}{" "}
                  <span className="text-sm">
                    {exercise.VARIANT ? `(${exercise.VARIANT})` : ""}
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
