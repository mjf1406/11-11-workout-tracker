"use client";

import { useEffect, useState } from "react";
import MainNav from "~/components/navigation/MainNav";
import type { ExerciseDb } from "~/server/db/types";
import { useAuth } from "@clerk/nextjs";
import { getExercisesByUserId } from "./actions";
import { Loader2 } from "lucide-react";
import "~/utils/string-extensions";
import { DataTable } from "~/components/ui/data-table";
import { columns } from "./columns";

export default function Exercises() {
  const [exercises, setExercises] = useState<ExerciseDb[]>([]);
  const [isLoading, setLoading] = useState(true);
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    const fetchExercises = async () => {
      if (!userId) return null;
      try {
        const userExercises: ExerciseDb[] = await getExercisesByUserId(userId);
        setExercises(userExercises);
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
        // Optionally set an error state here
      } finally {
        setLoading(false);
      }
    };
    void fetchExercises();
  }, [userId]); // Include userId in the dependency array if it's used in the effect

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
