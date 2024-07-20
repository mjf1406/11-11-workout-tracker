import { db } from "~/server/db/index";
import { 
    users as usersTable, 
    exercises as exercisesTable,
} from "~/server/db/schema";
import { type UserDb } from "~/server/db/types";
import { clerkClient } from "@clerk/nextjs/server";
import { EXERCISES } from "~/lib/constants";

export default async function insertUser(userId: string) {
    try {
        const user = await clerkClient.users.getUser(userId);
        const userName = `${user.firstName} ${user.lastName}`
        const userEmail = user.emailAddresses.find(i => i.id === user.primaryEmailAddressId)?.emailAddress
    
        const data: UserDb = {
            user_id: userId,
            user_name: userName,
            user_email: String(userEmail),
            user_role: 'user',
            joined_date: undefined,
            updated_date: undefined,
        }
        await db.insert(usersTable).values(data)
    } catch (err) {
        const error = err as Error;
        console.error("Failed to add the teacher.", error)
        throw new Error("Failed to add the teacher.", error)
    }
}

export async function insertNewUserExercises(userId: string) {
    if (!userId) throw new Error("User not authenticated")
    
    try {
        const exercises = EXERCISES.map(exercise => ({
            ...exercise,
            user_id: userId,
          }));
        await db.insert(exercisesTable).values(exercises)
    } catch (err) {
        const error = err as Error;
        console.error("Failed to add the teacher.", error)
        throw new Error("Failed to add the teacher.", error)
    }
}