// src/app/find-tutor/page.tsx
import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Find a Chinese Tutor - 1000 Chinese Words',
    description: 'Connect with experienced Chinese tutors to accelerate your learning journey.',
};

export default function FindTutorPage() {
  return (
     <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
      {/* Optional Header */}
      <header className="p-4 flex justify-between items-center">
         <Link href="/" className="text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-200 transition duration-150">
            ← Back to App
         </Link>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-700 p-6 md:p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200 border-b pb-2 border-slate-300 dark:border-slate-600">
            Find a Chinese Tutor
          </h1>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-4 text-slate-700 dark:text-slate-300">
             <p>
                Ready to take your Chinese skills to the next level with personalized guidance? Connecting with a real tutor can provide:
             </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Personalized feedback on pronunciation and grammar.</li>
                <li>Structured lessons tailored to your goals.</li>
                <li>Real-world conversation practice.</li>
                <li>Answers to your specific questions.</li>
              </ul>

            {/* --- Placeholder for Monetization Links --- */}
            <div className="mt-6 p-4 bg-sky-50 dark:bg-slate-600 rounded-md border border-sky-200 dark:border-slate-500">
                <h2 className="text-xl font-semibold mb-3 text-sky-800 dark:text-sky-200">Recommended Tutors & Platforms:</h2>
                <p className="mb-4">
                    We are working on partnerships to bring you recommendations for great tutors and learning platforms. Check back soon!
                </p>
                {/* Example Link (replace with actual affiliate links later) */}
                {/*
                <a
                    href="YOUR_AFFILIATE_LINK_HERE"
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="inline-block px-5 py-2 bg-amber-500 text-white rounded shadow hover:bg-amber-600 transition duration-150"
                >
                    Visit Example Platform
                </a>
                */}
                 <p className="text-sm mt-4">
                   (Note: Links on this page may be affiliate links, meaning we earn a small commission if you sign up, at no extra cost to you. This helps support the free learning tool!)
                 </p>
            </div>
            {/* --- End Placeholder --- */}

          </div>
           <div className="mt-8 text-center">
            <Link href="/" className="inline-block px-6 py-2 bg-sky-600 text-white rounded-lg shadow hover:bg-sky-700 transition duration-150">
                Continue Learning
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