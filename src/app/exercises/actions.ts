"use server"

import { db } from "~/server/db/index";
import { exercises as exercisesTable } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import type { ExerciseDb } from "~/server/db/types";
import { auth } from "@clerk/nextjs/server";

export async function getExercisesByUserId(userId: string) {
    "use server"

    if (!userId) throw new Error("User not authenticated")

    const exercises = await db
        .select()
        .from(exercisesTable)
        .where(eq(exercisesTable.user_id, userId))
        
    return exercises as ExerciseDb[]
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