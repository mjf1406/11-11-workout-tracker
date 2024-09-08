import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server'
import { db } from '~/server/db';
import { workouts } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const { userId } = auth();
  
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const userWorkouts = await db.select().from(workouts).where(eq(workouts.user_id, userId));
    return NextResponse.json(userWorkouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}