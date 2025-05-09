// src/app/api/user/progress/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next'; // Import getServerSession
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Import your authOptions
import prisma from '@/lib/prisma';
import { calculateSrs, ReviewQuality } from '@/lib/srs';

export async function POST(request: Request) {
  // 1. --- Get User Session ---
  const session = await getServerSession(authOptions);

  // 2. --- Authentication Check ---
  if (!session?.user?.id) {
    // User is not authenticated or session is invalid
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // --- Use the actual user ID from the session ---
  const userId = session.user.id;

  // 3. Parse Request Body
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { wordId, quality } = body;

  // 4. Validate Input
  if (
    typeof wordId !== 'number' ||
    typeof quality !== 'number' ||
    !([0, 1, 2, 3].includes(quality))
  ) {
    return NextResponse.json({ error: 'Invalid input: wordId must be a number, quality must be 0, 1, 2, or 3' }, { status: 400 });
  }
  const validatedQuality = quality as ReviewQuality;

  try {
    // 5. Fetch Existing Progress (if any) for the LOGGED-IN user
    const existingProgress = await prisma.wordProgress.findUnique({
      where: {
        userId_wordId: { // Use the compound unique key
          userId: userId, // Use actual userId
          wordId: wordId,
        },
      },
      select: { level: true, lastReviewedAt: true },
    });

    // 6. Calculate New SRS Stats
    const { newLevel, nextReviewDate } = calculateSrs(existingProgress, validatedQuality);
    const now = new Date();

    // 7. Upsert Word Progress in Database for the LOGGED-IN user
    const updatedProgress = await prisma.wordProgress.upsert({
      where: {
        userId_wordId: {
          userId: userId, // Use actual userId
          wordId: wordId,
        },
      },
      create: {
        userId: userId, // Use actual userId
        wordId: wordId,
        level: newLevel,
        nextReviewDate: nextReviewDate,
        lastReviewedAt: now,
      },
      update: {
        level: newLevel,
        nextReviewDate: nextReviewDate,
        lastReviewedAt: now,
      },
    });

    // 8. Return Success Response
    return NextResponse.json({ success: true, updatedProgress }, { status: 200 });

  } catch (error) {
    console.error(`Error updating word progress for user ${userId}, word ${wordId}:`, error);
    return NextResponse.json({ error: 'Failed to update word progress' }, { status: 500 });
  }
}
//   // 3. Validate Input
//   // src/app/api/user/progress/route.ts
// import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma';
// // Import ReviewQuality type along with the function
// import { calculateSrs, ReviewQuality } from '@/lib/srs';

// // ... TEST_USER_ID ...
// const TEST_USER_ID = "clerk-test-user-id-placeholder"; 
// export async function POST(request: Request) {
//     // ... Authentication placeholder ...
//     const userId = TEST_USER_ID;

//     // ... Parse Request Body ...
//     let body;
//     try {
//         body = await request.json();
//     } catch (error) {
//         return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
//     }

//     const { wordId, quality } = body;

//     // --- FIX: Validate Input & Assert Type ---
//     if (
//         typeof wordId !== 'number' ||
//         typeof quality !== 'number' ||
//         !([0, 1, 2, 3].includes(quality)) // More specific check
//     ) {
//         return NextResponse.json({ error: 'Invalid input: wordId must be a number, quality must be 0, 1, 2, or 3' }, { status: 400 });
//     }
// //   if (typeof wordId !== 'number' || typeof quality !== 'number' || quality < 0 || quality > 3) {
// //     return NextResponse.json({ error: 'Invalid input: wordId must be a number, quality must be between 0 and 3' }, { status: 400 });
// //   }
//   const validatedQuality = quality as ReviewQuality;
//   try {
//     // 4. Fetch Existing Progress (if any)
//     const existingProgress = await prisma.wordProgress.findUnique({
//       where: {
//         userId_wordId: { // Use the compound unique key
//           userId: userId,
//           wordId: wordId,
//         },
//       },
//       select: { level: true, lastReviewedAt: true }, // Only select needed fields
//     });

//     // 5. Calculate New SRS Stats
//     const { newLevel, nextReviewDate } = calculateSrs(existingProgress, validatedQuality);
//     const now = new Date();

//     // 6. Upsert Word Progress in Database
//     // Upsert = Update if exists, Create if not exists
//     const updatedProgress = await prisma.wordProgress.upsert({
//       where: {
//         userId_wordId: {
//           userId: userId,
//           wordId: wordId,
//         },
//       },
//       // Data to set if creating a new record
//       create: {
//         userId: userId,
//         wordId: wordId,
//         level: newLevel,
//         nextReviewDate: nextReviewDate,
//         lastReviewedAt: now,
//       },
//       // Data to set if updating an existing record
//       update: {
//         level: newLevel,
//         nextReviewDate: nextReviewDate,
//         lastReviewedAt: now,
//       },
//     });

//     // 7. Return Success Response
//     return NextResponse.json({ success: true, updatedProgress }, { status: 200 });

//   } catch (error) {
//     console.error("Error updating word progress:", error);
//     // Check for specific Prisma errors if needed (e.g., word not found)
//     return NextResponse.json({ error: 'Failed to update word progress' }, { status: 500 });
//   }
// }

// Optional: Add a simple GET handler for testing if needed
// export async function GET() {
//   return NextResponse.json({ message: 'Progress API is running' });
// }