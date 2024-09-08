import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server'
import { db } from '~/server/db';
import { exercises } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const { userId } = auth();
  
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const userExercises = await db.select().from(exercises).where(eq(exercises.user_id, userId));
    return NextResponse.json(userExercises);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}