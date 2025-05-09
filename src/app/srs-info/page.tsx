// src/app/srs-info/page.tsx
import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Spaced Repetition - 1000 Chinese Words',
    description: 'Learn how Spaced Repetition System (SRS) helps you memorize Chinese words efficiently.',
};

export default function SrsInfoPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
      {/* Optional: Add a consistent header later if using a shared layout */}
      <header className="p-4 flex justify-between items-center">
         <Link href="/" className="text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-200 transition duration-150">
            ← Back to App
         </Link>
         {/* Placeholder for AuthButton if needed on this page */}
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-700 p-6 md:p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200 border-b pb-2 border-slate-300 dark:border-slate-600">
            About Spaced Repetition (SRS)
          </h1>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-4 text-slate-700 dark:text-slate-300">
            <p>
              Spaced Repetition System (SRS) is a powerful learning technique based on the psychological principle of the **spacing effect**. It's incredibly effective for memorizing large amounts of information, like vocabulary!
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-3">How Does It Work?</h2>
            <p>
              Instead of cramming, SRS schedules reviews of learned items at increasing intervals. When you first learn a word, you'll review it soon. Each time you successfully recall it, the time until the *next* review increases exponentially.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Words you find **easy** are shown less frequently.</li>
              <li>Words you find **hard** are shown more frequently.</li>
            </ul>
            <p>
              This targets the optimal moment just before you're about to forget, strengthening the memory trace efficiently without wasting time on things you already know well.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-3">Why Use SRS for Chinese?</h2>
             <ul className="list-disc pl-5 space-y-1">
                <li>**Efficiency:** Focus your effort where it's needed most.</li>
                <li>**Long-Term Retention:** Builds strong, lasting memories, not just short-term recall.</li>
                <li>**Overcomes the Forgetting Curve:** Actively combats the natural tendency to forget information over time.</li>
            </ul>

             <h2 className="text-2xl font-semibold mt-6 mb-3">Our App's System</h2>
             <p>
               When you review a flashcard in our app (while logged in):
             </p>
             <ul className="list-disc pl-5 space-y-1">
                <li>**Again/Hard:** Tells the system you struggled. The word will appear again soon (often the same day or the next day).</li>
                <li>**Good:** You recalled it correctly. The interval until the next review will increase (e.g., a few days, then a week).</li>
                <li>**Easy:** You recalled it effortlessly. The interval will increase even more significantly (e.g., several days, then weeks).</li>
             </ul>
             <p>
               Stick with it consistently, and you'll be amazed at how effectively you can build and retain your Chinese vocabulary!
             </p>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="inline-block px-6 py-2 bg-sky-600 text-white rounded-lg shadow hover:bg-sky-700 transition duration-150">
                Start Learning!
            </Link>
          </div>
        </div>
      </main>

      {/* Optional Footer */}
       <footer className="w-full p-4 text-center text-xs text-slate-500 dark:text-slate-400">
         {/* Footer content */}
       </footer>
    </div>
  );
}