'use server'

import { db } from '~/server/db/index';
import { exercises } from '~/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server'
import type { Exercise } from '~/server/db/types';

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