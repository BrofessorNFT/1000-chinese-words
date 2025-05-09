// src/app/page.tsx
// import Flashcard from '@/components/Flashcard';
import { WordWithExamples, getRandomWord } from '@/lib/prisma'; // Keep getRandomWord for anonymous users
import prisma from '@/lib/prisma'; // Import prisma directly for specific queries
// import AuthButton from '@/components/AuthButton';
import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { authOptions } from '@/lib/auth';
import  PageClientContent  from '@/components/pageClientContent';
// import { FaSlidersH } from 'react-icons/fa'; // Icon for range control
// import RangeControlModal from '@/components/RangeControlModal'; // Import the modal
// import Link from 'next/link';
// import ThemeToggle from '@/components/ThemeToggle'; 
// No longer force dynamic always, let caching work where possible,
// but data fetching depends on session which changes per request.
// export const dynamic = 'force-dynamic';
// Instead, data fetching itself will make this dynamic.

/**
 * Fetches the next word for the user.
 * Priority: Due review cards -> New cards -> null (all done)
 */
// async function getNextWordForUser(userId: string): Promise<WordWithExamples | null> {
//   const now = new Date();

//   // 1. Find the earliest due review card
//   const dueProgress = await prisma.wordProgress.findFirst({
//     where: {
//       userId: userId,
//       nextReviewDate: { lte: now }, // Due date is now or in the past
//     },
//     orderBy: {
//       nextReviewDate: 'asc', // Get the most overdue card first
//     },
//     include: {
//       word: { // Include the related Word data
//         include: {
//           exampleSentences: true, // And its ExampleSentences
//         },
//       },
//     },
//     take: 1, // Only need one
//   });

//   if (dueProgress?.word) {
//     console.log(`Fetched DUE word for user ${userId}: ID ${dueProgress.word.id}`);
//     return dueProgress.word; // Return the Word object directly
//   }

//   // 2. If no due cards, find a new card (word user hasn't progressed on yet)
//   const newWord = await prisma.word.findFirst({
//     where: {
//       // Filter for words where there is NO WordProgress record for this user
//       userProgress: {
//         none: {
//           userId: userId,
//         },
//       },
//     },
//     orderBy: {
//       // A simple order for consistency when fetching new words (optional)
//       id: 'asc',
//     },
//     include: {
//       exampleSentences: true,
//     },
//   });

//   if (newWord) {
//      console.log(`Fetched NEW word for user ${userId}: ID ${newWord.id}`);
//      return newWord;
//   }

//   // 3. If no due cards and no new cards, user is caught up!
//   console.log(`User ${userId} is all caught up.`);
//   return null;
// }

async function getNextWordForUser(
  userId: string,
  rangeStart: number | null | undefined,
  rangeEnd: number | null | undefined
): Promise<WordWithExamples | null> {
  const now = new Date();
  console.log(`[${new Date().toISOString()}] getNextWordForUser called for user ${userId}, range: ${rangeStart}-${rangeEnd}`);

  const actualRangeStart = rangeStart ?? 1;
  const actualRangeEnd = rangeEnd ?? 1000; // Assuming 1000 words max

  // 1. Find due review card WITHIN THE USER'S RANGE
  const dueProgress = await prisma.wordProgress.findFirst({
      where: {
          userId: userId,
          nextReviewDate: { lte: now },
          word: { // Filter by word ID within the range
              id: {
                  gte: actualRangeStart,
                  lte: actualRangeEnd,
              },
          },
      },
      orderBy: { nextReviewDate: 'asc' },
      include: { word: { include: { exampleSentences: true }}},
      take: 1,
  });

  if (dueProgress?.word) { /* ... log and return ... */ return dueProgress.word; }

  // 2. Find a new card WITHIN THE USER'S RANGE
  const newWord = await prisma.word.findFirst({
      where: {
          id: { // Filter by word ID within the range
              gte: actualRangeStart,
              lte: actualRangeEnd,
          },
          userProgress: {
              none: { userId: userId },
          },
      },
      orderBy: { id: 'asc' },
      include: { exampleSentences: true },
  });

  if (newWord) { /* ... log and return ... */ return newWord; }

  console.log(`User ${userId} is all caught up within range ${actualRangeStart}-${actualRangeEnd}.`);
  return null;
}

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  let word: WordWithExamples | null = null;
  let userSettings = null; // To store user's range preferences

  if (userId) {
    // Fetch user settings (including range) along with the word
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { studyRangeStart: true, studyRangeEnd: true }
    });
    userSettings = user; // Store for modal and word fetching
    word = await getNextWordForUser(userId, user?.studyRangeStart, user?.studyRangeEnd);
  } else {
    word = await getRandomWord();
  }

  // This part is rendered on the server. To manage modal state,
  // we'd ideally have a client component wrapper.
  // For simplicity now, we'll pass initial settings to a client modal
  // and trigger it from a client button if possible, or move more to client.

  return (
    // Pass userSettings down to a client component part if modal state is there
    <PageClientContent
    initialWord={word}
    initialUserSettings={userSettings}
    session={session} // Pass the whole session or just necessary parts
  />
  );
}

// --- NEW Client Component to wrap page content and manage modal ---
// Create this as src/components/PageClientContent.tsx
// For now, I will inline a simplified version of its role directly
// in page.tsx for brevity and show how to integrate the modal.
// It's better to extract this to its own file: src/components/PageClientContent.tsx


// export default async function HomePage() {
//   // --- Get Session ---
//   const session = await getServerSession(authOptions);
//   const userId = session?.user?.id; // Get user ID if logged in
//   let userSettings = null;
//   // --- Fetch Word based on Session ---
//   let word: WordWithExamples | null = null;
//   if (userId) {
//     // Logged in: Fetch based on SRS progress
//     word = await getNextWordForUser(userId);
//   } else {
//     // Not logged in: Fetch a random word
//     word = await getRandomWord();
//   }

//   return (
//     <div className="flex min-h-screen flex-col  from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
//       <header className="w-full p-3 sm:p-4 flex justify-between items-center sticky top-0 z-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800"> {/* Adjusted header style */}
//         {/* Add a simple Title/Logo */}
//         <Link href="/" className="text-lg font-semibold text-slate-800 dark:text-slate-200 hover:opacity-80 transition">
//             1000 Chinese Words
//         </Link>
//         <div className="flex items-center gap-2 sm:gap-3"> {/* Container for buttons */}
//             <ThemeToggle />
//             <AuthButton />
//         </div>
//       </header>

//       <main className="flex flex-grow flex-col items-center justify-center px-6 pb-10 pt-4">
//         <div className="w-full max-w-md space-y-6">
//           <h1 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-200">
//             1000 Chinese Words
//           </h1>

//           {/* --- Updated Content Display --- */}
//           {word ? (
//             // If a word was found (due, new, or random)
//             <Flashcard word={word} />
//           ) : userId ? (
//             // Logged in, but no word found (means they are caught up)
//             <div className="p-6 bg-white dark:bg-slate-700 rounded-lg shadow-md text-center text-slate-600 dark:text-slate-300 min-h-[300px] flex flex-col items-center justify-center space-y-3">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <p className="font-semibold">Congratulations!</p>
//               <p>You&apos;re all caught up on your reviews for now.</p>
//               <p className="text-sm text-slate-500">Check back later for new reviews.</p>
//             </div>
//           ) : (
//             // Not logged in, and couldn't fetch a random word (DB error?)
//             <div className="p-6 bg-white dark:bg-slate-700 rounded-lg shadow-md text-center text-slate-600 dark:text-slate-300 min-h-[300px] flex items-center justify-center">
//               <p>Could not load word. Please try again later.</p>
//             </div>
//           )}

//           {/* Updated message based on session */}
//           <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
//             {userId ? `Logged in as ${session?.user?.email}` : "Sign in to save progress and enable Spaced Repetition!"}
//           </p>
//         </div>
//       </main>
//       <footer className="w-full p-4 mt-8 text-center text-sm text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700">
//          <div className="flex justify-center gap-4 md:gap-6">
//             <Link href="/srs-info" className="hover:text-sky-600 dark:hover:text-sky-400 transition duration-150">
//                 What is SRS?
//             </Link>
//             <Link href="/find-tutor" className="hover:text-sky-600 dark:hover:text-sky-400 transition duration-150">
//                 Find a Tutor
//             </Link>
//             {/* Add other links later if needed (e.g., Privacy Policy) */}
//          </div>
//           <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
//               © {new Date().getFullYear()} 1000 Chinese Words
//           </p>
//       </footer>
//     </div>
//   );
// }
