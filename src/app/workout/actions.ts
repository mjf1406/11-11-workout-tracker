"use server"

import { auth } from "@clerk/nextjs/server";
import { getExercisesByUserId } from "../exercises/actions";
import { ROUTINE_SETTINGS } from "~/lib/constants";
import { generateRoutine, shuffleArray } from "~/utils/genWorkoutHelpers";
import type { Exercise, ExerciseDb } from "~/server/db/types";


export async function handleGenerateRoutine(): Promise<ExerciseDb[]> {
    const { userId } = auth();
    if (!userId) throw new Error("User not authenticated")

    let userExercises: ExerciseDb[] = await getExercisesByUserId(userId)
    userExercises = userExercises.filter(e => e.used === false)

    const userSettings = ROUTINE_SETTINGS // TODO: get from the db

    const generatedRoutine = generateRoutine(userSettings, userExercises);
    const allExercises = [
      ...generatedRoutine.upperPull,
      ...generatedRoutine.upperPush,
      ...generatedRoutine.lower,
      ...generatedRoutine.abs,
    ];
    const routine = await shuffleArray(allExercises)
    return routine
}