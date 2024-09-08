"use client";

import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "~/components/ui/data-table";
import { columns } from "./columns";
import { fetchExercises } from "~/app/api/fetchers";
import "~/utils/string-extensions";
import type {
  Exercise,
  ExercisesResponse,
  Days,
  FormattedDays,
} from "~/server/db/types";

const formatForcedDays = (
  forcedDays: Days | undefined,
): FormattedDays | "Every day" | "None" => {
  if (!forcedDays || forcedDays.length === 0) return "None";

  const dayMap: Record<number, FormattedDays[number]> = {
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
    7: "Sun",
  };

  const array = forcedDays
    .map((day) => dayMap[day])
    .filter((day): day is FormattedDays[number] => day !== undefined)
    .sort((a, b) => {
      const order: FormattedDays = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun",
      ];
      return order.indexOf(a) - order.indexOf(b);
    });

  return array.length === 7 ? "Every day" : (array as FormattedDays);
};

export type ExerciseWithFormattedDays = Omit<Exercise, "formatted_days"> & {
  formatted_days: FormattedDays | "Every day" | "None";
};

export default function ExercisesClient() {
  const { data: exercises } = useSuspenseQuery<
    ExercisesResponse,
    Error,
    ExerciseWithFormattedDays[]
  >({
    queryKey: ["exercises"],
    queryFn: fetchExercises,
    select: (data) =>
      data.map((exercise) => ({
        ...exercise,
        formatted_days: formatForcedDays(exercise.forced_days),
      })),
  });

  return (
    <main className="flex flex-col items-center justify-center p-5 text-foreground">
      <div className="container mx-auto py-5">
        <DataTable columns={columns} data={exercises} />
      </div>
    </main>
  );
}
