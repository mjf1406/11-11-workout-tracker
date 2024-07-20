"use server"

import { db } from "~/server/db/index";
import { settings as settingsTable } from "~/server/db/schema";
import type { SettingsDb } from "~/server/db/types";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function saveSettings(settings: SettingsDb) {
    const { userId } = auth()
    if (!userId) throw new Error("User not authenticated")

    try { 
        await db 
            .update(settingsTable)
            .set(settings)
            .where(eq(settingsTable.user_id, userId))
            .values(settings)

    } catch (err) {
        const error = err as Error;
        console.error("Failed to save settings.", error)
        throw new Error("Failed to save settings.", error)
    }
}

export async function getSettings(): Promise<SettingsDb[]> {
    const { userId } = auth();
    if (!userId) throw new Error("User not authenticated")

    const settings: SettingsDb[] = await db
        .select()
        .from(settingsTable)
        .where(eq(settingsTable.user_id, userId))

    if(!settings) throw new Error("Settings is undefined")
    return settings
}