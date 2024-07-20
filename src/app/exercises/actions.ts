import { db } from "~/server/db/index";
import { exercises as exercisesTable } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import type { ExerciseDb } from "~/server/db/types";

export async function getExercisesByUserId(userId: string) {
    "use server";

    if (!userId) throw new Error("User not authenticated")

    const exercises = await db
        .select()
        .from(exercisesTable)
        .where(eq(exercisesTable.user_id, userId))
        
    return exercises
}

export async function createExercise(userId: string, exercise: ExerciseDb) {
    "use server";

    if (!userId) throw new Error("User not authenticated")

    await db.insert(exercisesTable).values(exercise)

}