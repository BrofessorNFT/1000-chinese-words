// src/app/loading.tsx
import React from 'react';

// Optional: Add a spinner component or library if desired
// e.g., import { CgSpinner } from 'react-icons/cg';

export default function Loading() {
  // You can add any UI you want here.
  // Simple text or a spinner component.
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
        <div className="w-full max-w-md space-y-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 dark:border-sky-400 mx-auto"></div>
            {/* Or use an icon spinner: <CgSpinner className="animate-spin h-12 w-12 text-sky-600 dark:text-sky-400 mx-auto" /> */}
            <p className="text-slate-600 dark:text-slate-300">Loading next word...</p>
        </div>
    </main>
  );
}