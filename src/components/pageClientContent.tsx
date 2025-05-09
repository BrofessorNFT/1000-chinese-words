// src/app/page.tsx
'use client'
import Flashcard from '@/components/Flashcard';
import { WordWithExamples} from '@/lib/prisma'; // Keep getRandomWord for anonymous users

import AuthButton from '@/components/AuthButton';

import { FaSlidersH } from 'react-icons/fa'; // Icon for range control
import RangeControlModal from '@/components/RangeControlModal'; // Import the modal
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import { useState } from 'react'; 
import type { Session } from 'next-auth'; // Import Session type

interface PageClientContentProps {
    initialWord: WordWithExamples | null;
    initialUserSettings: { studyRangeStart?: number | null; studyRangeEnd?: number | null } | null;
    session: Session | null; // Use the actual Session type
  }
  const MIN_WORD_ID = 1;
  const MAX_WORD_ID = 1000;



  export default function PageClientContent({
    initialWord,
    initialUserSettings,
    session,
  }: PageClientContentProps) {
    const [isRangeModalOpen, setIsRangeModalOpen] = useState(false);
    const userId = session?.user?.id;
  
    return (
      <div className="flex min-h-screen flex-col from-slate-50 via-stone-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 text-slate-700 dark:text-slate-300 selection:bg-pink-300 dark:selection:bg-pink-700">
        <header className="w-full p-3 sm:p-4 flex justify-between items-center sticky top-0 z-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800">
          <Link href="/" className="text-lg font-semibold text-slate-800 dark:text-slate-200 hover:opacity-80 transition">
            1000 Chinese Words
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Range button REMOVED from here */}
            <ThemeToggle />
            <AuthButton />
          </div>
        </header>
  
        <main className="flex flex-grow flex-col items-center justify-center px-4 sm:px-6 pb-10 pt-4">
          <div className="w-full max-w-md space-y-6">
            {/* --- Title and Range Button Group --- */}
            <div className="flex items-center justify-center gap-3 mb-2 relative"> {/* Center title and button */}
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-200">
                1000 Chinese Words
              </h1>
              {userId && ( // Only show range button if logged in
                <button
                  onClick={() => setIsRangeModalOpen(true)}
                  className="p-2 rounded-md text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-500 transition duration-150"
                  title="Set Study Range"
                  // Optional: Add absolute positioning if you want it slightly offset from title
                  // className="absolute right-0 top-1/2 -translate-y-1/2 p-2 ... "
                >
                  <FaSlidersH size={18} />
                </button>
              )}
            </div>
            {/* --- End Title and Range Button Group --- */}
  
  
            {initialWord ? (
              <Flashcard word={initialWord} />
            ) : userId ? (
              <div className="p-6 bg-white dark:bg-slate-700 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-slate-800/50 min-h-[300px] flex flex-col items-center justify-center space-y-3 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-semibold text-slate-800 dark:text-slate-100">Congratulations!</p>
                <p className="text-slate-600 dark:text-slate-300">
                  You&aposre all caught up within your selected range (
                  {initialUserSettings?.studyRangeStart ?? MIN_WORD_ID}-
                  {initialUserSettings?.studyRangeEnd ?? MAX_WORD_ID}).
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Check back later or adjust your range!</p>
              </div>
            ) : (
              <div className="p-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-slate-800/50 min-h-[300px] flex items-center justify-center text-center">
                <p className="text-slate-600 dark:text-slate-300">Could not load word. Please ensure the database is seeded and try again.</p>
              </div>
            )}
  
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
              {userId
                ? `Range: ${initialUserSettings?.studyRangeStart ?? MIN_WORD_ID}-${initialUserSettings?.studyRangeEnd ?? MAX_WORD_ID}. Logged in as ${session?.user?.email || 'User'}`
                : "Sign in to save progress and enable Spaced Repetition!"}
            </p>
          </div>
        </main>
  
        <RangeControlModal
          isOpen={isRangeModalOpen}
          onClose={() => setIsRangeModalOpen(false)}
          currentStart={initialUserSettings?.studyRangeStart}
          currentEnd={initialUserSettings?.studyRangeEnd}
        />
  
  <footer className="w-full p-4 mt-8 text-center text-sm text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700">
        <div className="flex justify-center gap-4 md:gap-6">
          <Link href="/srs-info" className="hover:text-sky-600 dark:hover:text-sky-400 transition duration-150">
            What is SRS?
          </Link>
          <Link href="/find-tutor" className="hover:text-sky-600 dark:hover:text-sky-400 transition duration-150">
            Find a Tutor
          </Link>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
          © {new Date().getFullYear()} 1000 Chinese Words
        </p>
      </footer>
      </div>
    );
  }

