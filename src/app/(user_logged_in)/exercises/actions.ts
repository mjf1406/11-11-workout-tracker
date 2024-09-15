'use server'

import { db } from '~/server/db/index';
import { exercises } from '~/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server'
import type { Exercise } from '~/server/db/types';
import type { BatchItem, BatchResponse } from 'drizzle-orm/batch';

export async function createExercise(exercise: Omit<Exercise, 'id' | 'user_id' | 'created_date' | 'updated_date'>) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  await db.insert(exercises).values({
    ...exercise,
    user_id: userId,
  });

  revalidatePath('/exercises');
}

export async function updateExercise(id: number, exercise: Partial<Exercise>) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  await db.update(exercises)
    .set(exercise)
    .where(and(
      eq(exercises.id, id), 
      eq(exercises.user_id, userId)
    )
  )
  revalidatePath('/exercises');
}

export async function markExercisesAsUsed(exercisesData: Partial<Exercise> | Partial<Exercise>[]) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  try {
    const exercisesArray = Array.isArray(exercisesData) ? exercisesData : [exercisesData];

    const updateResults = await Promise.all(exercisesArray.map(async (exercise) => {
      if (!exercise.id) throw new Error('Exercise ID is required for update');

      const result = await db
        .update(exercises)
        .set({ used: true})
        .where(and(
          eq(exercises.id, exercise.id),
          eq(exercises.user_id, userId)
        ));

      return { id: exercise.id, result };
    }));

    revalidatePath('/exercises');
    return { success: true, message: "Exercises updated successfully.", results: updateResults };
  } catch (err) {
    console.error(err);
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    throw new Error(errorMessage);
  }
}

export async function updateExercises(exercisesData: Partial<Exercise> | Partial<Exercise>[]) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  try {
    const exercisesArray = Array.isArray(exercisesData) ? exercisesData : [exercisesData];

    const updateResults = await Promise.all(exercisesArray.map(async (exercise) => {
      if (!exercise.id) throw new Error('Exercise ID is required for update');

      const result = await db.update(exercises)
        .set(exercise)
        .where(and(
          eq(exercises.id, exercise.id),
          eq(exercises.user_id, userId)
        ));

      return { id: exercise.id, result };
    }));

    revalidatePath('/exercises');
    return { success: true, message: "Exercises updated successfully.", results: updateResults };
  } catch (err) {
    console.error(err);
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    throw new Error(errorMessage);
  }
}

export async function deleteExercise(id: number) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  await db.delete(exercises)
    .where(
      and(
        eq(exercises.id, id),
        eq(exercises.user_id, userId)
      )
    );

  revalidatePath('/exercises');
}