import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server'
import { db } from '~/server/db';
import { settings } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const { userId } = auth();
  
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const userSettings = await db.select().from(settings).where(eq(settings.user_id, userId));
    return NextResponse.json(userSettings[0] ?? null);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}