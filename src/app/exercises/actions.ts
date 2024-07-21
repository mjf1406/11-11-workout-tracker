"use server"

import { db } from "~/server/db/index";
import { exercises as exercisesTable } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import type { ExerciseDb, ExerciseRoutine } from "~/server/db/types";
import { auth } from "@clerk/nextjs/server";
import { getWorkoutsByUserId } from "../workout/actions";

export async function  getExercisesByUserId(userId: string) {
    "use server"

    if (!userId) throw new Error("User not authenticated")

    const exercises = await db
        .select()
        .from(exercisesTable)
        .where(eq(exercisesTable.user_id, userId))
        
    return exercises as ExerciseRoutine[]
}

export async function createExercise(userId: string, exercise: ExerciseDb) {
    "use server";

    if (!userId) throw new Error("User not authenticated")

    await db.insert(exercisesTable).values(exercise)

}

export async function deleteExercise(exerciseId: number | undefined) {
    "use server"
    
    if (!exerciseId) throw new Error("exerciseId is undefined")

    const { userId } = auth();
    if (!userId) throw new Error("User not authenticated")

    try {
        await db
            .delete(exercisesTable)
            .where(
                eq(exercisesTable.id, exerciseId)
            )
    } catch (err) {
        const error = err as Error;
        console.error("Failed to delete exercise.", error)
        throw new Error("Failed to delete exercise.", error)
    }
}

export async function getExerciseById(exerciseId: number) {
    "use server"
    
    if (!exerciseId) throw new Error("exerciseId is undefined")

    const { userId } = auth();
    if (!userId) throw new Error("User not authenticated")

        const exercises = await db
            .select()
            .from(exercisesTable)
            .where(
                and(
                    eq(exercisesTable.user_id, userId),
                    eq(exercisesTable.id, exerciseId)
                )
            )
    return exercises[0] as ExerciseDb
}

export async function setExerciseUsedById(exerciseId: number, state: boolean) {
    "use server"
    
    if (!exerciseId) throw new Error("exerciseId is undefined")

    const { userId } = auth();
    if (!userId) throw new Error("User not authenticated")

    try {
        await db
            .update(exercisesTable)
            .set({used: state})
            .where(
                eq(exercisesTable.id, exerciseId)
            )
    } catch (err) {
        const error = err as Error;
        console.error(`Failed to set exercise ${exerciseId} as used.`, error)
        throw new Error(`Failed to set exercise ${exerciseId} as used.`, error)
    }
}

export async function getPreviousExerciseSetDataById(exerciseId: number) {
    "use server"
    
    
    const { userId } = auth();
    if (!userId) throw new Error("User not authenticated")
        
    if (!exerciseId) throw new Error("exerciseId is undefined")

    const workouts = await getWorkoutsByUserId(userId)
    
    return workouts.filter(workout => 
        workout.exercises.some(exercise => exercise.id === exerciseId)
    );    
    
}