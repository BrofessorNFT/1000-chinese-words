// src/components/RefreshButton.tsx
'use client'; // This component needs client-side interaction (onClick)

import { useRouter } from 'next/navigation'; // Use App Router's router

export default function RefreshButton() {
  const router = useRouter();

  const handleRefresh = () => {
    router.refresh(); // This re-runs the Server Component's data fetching
  };

  return (
    <button
      onClick={handleRefresh}
      className="px-6 py-2 bg-sky-600 text-white rounded-lg shadow hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition duration-150 ease-in-out"
    >
      Next Word
    </button>
  );
}