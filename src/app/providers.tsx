// src/app/providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
// import { ThemeProvider } from 'next-themes'; // Import ThemeProvider
import { ThemeProvider } from '@/components/theme-provider';
import React from 'react';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    // ThemeProvider MUST wrap SessionProvider and children
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
          {children}
      </SessionProvider>
    </ThemeProvider>
  );
}