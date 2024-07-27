"use client";

import { useEffect, useState } from "react";
import MainNav from "~/components/navigation/MainNav";
import type { ExerciseRoutine } from "~/server/db/types";
import { useAuth } from "@clerk/nextjs";
import { getExercisesByUserId } from "./actions";
import { Loader2 } from "lucide-react";
import "~/utils/string-extensions";
import { DataTable } from "~/components/ui/data-table";
import { columns } from "./columns";

type DayStructure = {
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
  sat: boolean;
  sun: boolean;
};

export type Exercises = {
  id: number | undefined;
  user_id: string;
  name: string;
  variant: string;
  body_part: string;
  type: string;
  used: boolean;
  unit: "reps" | "stopwatch";
  forced_days: string[];
  created_date: string | undefined;
  updated_date: string | undefined;
};

const convertForcedDaysToArray = (
  forcedDays: DayStructure,
): string[] | string => {
  const dayMap: Record<keyof DayStructure, string> = {
    mon: "Mon",
    tue: "Tue",
    wed: "Wed",
    thu: "Thu",
    fri: "Fri",
    sat: "Sat",
    sun: "Sun",
  };

  const array = (Object.entries(forcedDays) as [keyof DayStructure, boolean][])
    .filter(([_, value]) => value)
    .map(([key, _]) => dayMap[key]);

  return array.length === 7 ? "Every day" : array;
};

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercises[]>([]);
  const [isLoading, setLoading] = useState(true);
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    const fetchExercises = async () => {
      if (!userId) return null;
      try {
        const userExercises: ExerciseRoutine[] =
          await getExercisesByUserId(userId);
        // Convert forced_days to array for each exercise
        const processedExercises = userExercises.map((exercise) => ({
          ...exercise,
          forced_days: convertForcedDaysToArray(
            exercise.forced_days as DayStructure,
          ),
        }));
        setExercises(processedExercises as Exercises[]);
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
      } finally {
        setLoading(false);
      }
    };
    void fetchExercises();
  }, [userId]);

  if (!isLoaded || !userId) {
    return null;
  }

  return (
    <>
      <MainNav />
      <main className="flex flex-col items-center justify-center bg-background p-5 text-foreground">
        <div className="text-4xl">My Exercises</div>
        {isLoading ? (
          <div className="flex flex-row gap-2">
            {" "}
            <Loader2 className="animate-spin" /> Loading exercises...
          </div>
        ) : (
          <div className="container mx-auto py-5">
            <DataTable columns={columns} data={exercises} />
          </div>
        )}
      </main>
    </>
  );
}
