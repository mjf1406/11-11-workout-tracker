'use server'

import { db } from '~/server/db/index';
import { settings } from '~/server/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server'
import type { Settings } from '~/server/db/types';

export async function createOrUpdateSettings(settingsData: Omit<Settings, 'user_id' | 'created_date' | 'updated_date'>) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  await db.insert(settings)
    .values({
      ...settingsData,
      user_id: userId,
    })
    .onConflictDoUpdate({
      target: settings.user_id,
      set: settingsData,
    });

  revalidatePath('/settings');
}

export async function deleteSettings() {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  await db.delete(settings)
    .where(eq(settings.user_id, userId));

  revalidatePath('/settings');
}

export async function saveSettings(settingsData: Settings): Promise<{ success: boolean; message: string }> {
  const { userId } = auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    await db
      .update(settings)
      .set(settingsData)
      .where(eq(settings.user_id, userId));

    revalidatePath('/settings'); // Adjust the path as needed

    return { success: true, message: 'Settings saved successfully!' };
  } catch (error) {
    console.error('Error saving settings:', error);
    return { success: false, message: 'Failed to save settings. Please try again.' };
  }
}