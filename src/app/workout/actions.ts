"use server"

import { db } from "~/server/db/index";
import { auth } from "@clerk/nextjs/server";
import { getExercisesByUserId, setExerciseUsedById } from "../exercises/actions";
import { generateRoutine, shuffleArray } from "~/utils/genWorkoutHelpers";
import type { ExerciseDb, ExerciseRoutine, SettingsDb, Workout } from "~/server/db/types";
import { workouts as workoutsTable } from "~/server/db/schema";
import { getSettings } from "../settings/actions";
import { eq, desc } from "drizzle-orm";

export async function handleGenerateRoutine(): Promise<ExerciseRoutine[]> {
    "use server"
  
    const { userId } = auth();
    if (!userId) throw new Error("User not authenticated")

    const userExercises: ExerciseDb[] = await getExercisesByUserId(userId)
    const userSettings = await getSettings()
    const settings: SettingsDb | undefined = userSettings[0]
    if(!settings) throw new Error("Settings is undefined")
    const generatedRoutine = await generateRoutine(settings, userExercises);
    const allExercises = [
      ...generatedRoutine.upper_pull,
      ...generatedRoutine.upper_push,
      ...generatedRoutine.lower,
      ...generatedRoutine.abs,
    ];
    const routine = await shuffleArray(allExercises)
    return routine
}

export async function saveWorkout(workout: Workout) {
    "use server"

    const { userId } = auth();
    if (!userId) throw new Error("User not authenticated")

    workout.user_id = userId

    for (const exercise of workout.exercises) {
       await setExerciseUsedById(exercise.id, true)
    }

    try {
        const [savedWorkout] = await db
            .insert(workoutsTable)
            .values(workout)
            .returning();
        return savedWorkout;
    } catch (err) {
        const error = err as Error;
        console.error("Failed to save workout.", error)
        throw new Error("Failed to save workout.", error)
    }
}

export async function getWorkoutsByUserId(userId: string): Promise<Workout[]> {
    "use server"

    if (!userId) throw new Error("User not authenticated")

    const workouts = await db
        .select()
        .from(workoutsTable)
        .where(
            eq(workoutsTable.user_id, userId)
        )
        .orderBy(desc(workoutsTable.created_date))
    
    return workouts as Workout[]
}