"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import {
  fetchExercises,
  fetchSettings,
  fetchWorkouts,
} from "~/app/api/fetchers";
import WorkoutClient from "./WorkoutClient";

export default function WorkoutContent() {
  const { data: settings } = useSuspenseQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  const { data: exercises } = useSuspenseQuery({
    queryKey: ["exercises"],
    queryFn: fetchExercises,
  });

  const { data: workouts } = useSuspenseQuery({
    queryKey: ["workouts"],
    queryFn: fetchWorkouts,
  });

  return (
    <WorkoutClient
      initialSettings={settings}
      initialExercises={exercises}
      initialWorkouts={workouts}
    />
  );
}
