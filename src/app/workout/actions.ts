"use server"

import { db } from "~/server/db/index";
import { auth } from "@clerk/nextjs/server";
import { getExercisesByUserId } from "../exercises/actions";
import { generateRoutine, shuffleArray } from "~/utils/genWorkoutHelpers";
import type { ExerciseDb, SettingsDb, Workout } from "~/server/db/types";
import { workouts as workoutsTable } from "~/server/db/schema";
import { getSettings } from "../settings/actions";


export async function handleGenerateRoutine(): Promise<ExerciseDb[]> {
    "use server"
  
    const { userId } = auth();
    if (!userId) throw new Error("User not authenticated")

    let userExercises: ExerciseDb[] = await getExercisesByUserId(userId)
    userExercises = userExercises.filter(e => e.used === false)

    const userSettings = await getSettings()
    const settings: SettingsDb | undefined = userSettings[0]
    if(!settings) throw new Error("Settings is undefined")
    const generatedRoutine = generateRoutine(settings, userExercises);
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