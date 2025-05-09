// src/app/api/user/settings/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; // Use shared authOptions
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  let body;
  try {
    body = await request.json();
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { studyRangeStart, studyRangeEnd } = body;

  // Validate input (basic validation)
  if (
    (studyRangeStart !== undefined && typeof studyRangeStart !== 'number') ||
    (studyRangeEnd !== undefined && typeof studyRangeEnd !== 'number') ||
    (typeof studyRangeStart === 'number' && studyRangeStart < 1) || // Assuming word IDs/ranks start at 1
    (typeof studyRangeEnd === 'number' && studyRangeEnd < 1) ||
    (typeof studyRangeStart === 'number' && typeof studyRangeEnd === 'number' && studyRangeStart > studyRangeEnd)
    // Add max range check if you have a fixed number of words (e.g., studyRangeEnd <= 1000)
  ) {
    return NextResponse.json({ error: 'Invalid range values.' }, { status: 400 });
  }

  try {
    // Prepare data for update, only include fields that are provided
    const updateData: { studyRangeStart?: number; studyRangeEnd?: number } = {};
    if (studyRangeStart !== undefined) {
      updateData.studyRangeStart = studyRangeStart;
    }
    if (studyRangeEnd !== undefined) {
      updateData.studyRangeEnd = studyRangeEnd;
    }

    if (Object.keys(updateData).length === 0) {
        return NextResponse.json({ error: 'No settings provided to update.' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      studyRangeStart: updatedUser.studyRangeStart,
      studyRangeEnd: updatedUser.studyRangeEnd,
    });

  } catch (error) {
    console.error(`Failed to update settings for user ${userId}:`, error);
    return NextResponse.json({ error: 'Failed to update settings.' }, { status: 500 });
  }
}