// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Ensure globals is imported
import Providers from './providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// --- RESTORED Metadata ---
export const metadata: Metadata = {
  title: '1000 Chinese Words - Zen Study',
  description: 'Calmly learn the 1000 most common Chinese words with SRS.',
};

// --- RESTORED Viewport ---
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' }, // slate-50 (or light --background)
    { media: '(prefers-color-scheme: dark)', color: '#030712' }, // slate-950 (or dark --background)
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning={true}>
      {/* Body class only sets text/selection colors, background is handled by CSS */ }
      <body className="text-slate-700 dark:text-slate-300 selection:bg-pink-300 dark:selection:bg-pink-700">
        {/* The body::before pseudo-element handles the background pattern via globals.css */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}