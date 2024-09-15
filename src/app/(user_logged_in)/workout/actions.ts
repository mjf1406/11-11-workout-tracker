'use server'

import { db } from '~/server/db/index';
import { workouts } from '~/server/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server'
import type { FilteredWorkoutData } from '~/server/db/types';

export async function createWorkout(workout: FilteredWorkoutData | null): Promise<{ success: boolean; message: string }> {
  if (!workout) return { success: false, message: "No workout data found. Please try again." };
  
  const { userId } = auth();
  if (!userId) return { success: false, message: "Unauthorized" };

  try {
    await db.insert(workouts).values({
      user_id: userId,
      exercises: workout.exercises.map(exercise => ({
        id: exercise.id,
        sets: exercise.sets,
      })),
      used: 1, // Ensure the workout gets marked as used so it won't be used again until all others are used
    });
    
    return { success: true, message: 'Workout saved successfully!' };
  } catch (error) {
    console.error('Error saving workout:', error);
    return { success: false, message: 'Failed to save workout. Please try again.' };
  }
}

export async function updateWorkout(id: number, workout: FilteredWorkoutData) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  await db.update(workouts)
    .set(workout)
    .where(eq(workouts.id, id) && eq(workouts.user_id, userId));

  revalidatePath('/workouts');
}

export async function deleteWorkout(id: number) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  await db.delete(workouts)
    .where(eq(workouts.id, id) && eq(workouts.user_id, userId));

  revalidatePath('/workouts');
}
