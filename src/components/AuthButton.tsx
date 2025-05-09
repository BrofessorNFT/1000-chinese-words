// src/components/AuthButton.tsx
'use client'; // This component uses hooks and event handlers

import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image'; // Use Next.js Image for optimization
import React from 'react';

export default function AuthButton() {
  const { data: session, status } = useSession(); // Get session data and status

  const handleSignIn = () => {
    signIn('google'); // Specify the provider key ('google')
  };

  const handleSignOut = () => {
    signOut(); // Default signOut redirects to homepage
    // To redirect elsewhere: signOut({ callbackUrl: '/logged-out' });
  };

  // Loading state while session status is being determined
  if (status === 'loading') {
    return (
      // Simple loading skeleton
      <div className="h-10 w-24 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700"></div>
    );
  }

  // If user is logged in (authenticated)
  if (status === 'authenticated' && session?.user) {
    return (
      <div className="flex items-center gap-3">
        {/* Display user image if available */}
        {session.user.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || 'User profile picture'}
            width={40} // Adjust size as needed
            height={40}
            className="rounded-full border-2 border-sky-500" // Added border for visibility
          />
        )}
        {/* Optional: Display user name if available */}
        {/* <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:inline">
            {session.user.name || session.user.email}
        </span> */}
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          Sign Out
        </button>
      </div>
    );
  }

  // If user is not logged in (unauthenticated)
  return (
    <button
      onClick={handleSignIn}
      className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-md shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 flex items-center gap-2"
    >
        {/* Optional: Add Google Icon using react-icons or SVG */}
        {/* Example with SVG (inline or component) */}
        <svg className="w-5 h-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244.8 512 112.8 512 0 398.5 0 261.8 0 127.3 104.4 16.6 238.6 16.6 306.6 16.6 359.3 41.8 394.6 74.5L335.9 132.1C317.2 115.8 282.7 94.3 238.6 94.3 166.7 94.3 107.7 152.9 107.7 225.1s59.1 130.8 131 130.8c51.4 0 84.4-20.1 108.8-43.5 18.6-17.9 31.2-43.5 36.2-75.9H238.6V229.5H472c1.9 10.9 3.1 22.8 3.1 35.1z"></path></svg>
      Sign in with Google
    </button>
  );
}