// src/components/RangeControlModal.tsx
'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { FaTimes, FaSave, FaSpinner } from 'react-icons/fa';
import { useRouter } from 'next/navigation'; // To refresh data after settings change

interface RangeControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStart: number | null | undefined;
  currentEnd: number | null | undefined;
}

// Assuming words are indexed 1 to 1000
const MIN_WORD_ID = 1;
const MAX_WORD_ID = 1000;

export default function RangeControlModal({
  isOpen,
  onClose,
  currentStart,
  currentEnd,
}: RangeControlModalProps) {
  const router = useRouter();
  const [start, setStart] = useState<string>(String(currentStart ?? MIN_WORD_ID));
  const [end, setEnd] = useState<string>(String(currentEnd ?? MAX_WORD_ID));
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Update local state if props change (e.g., after successful save and parent re-fetches)
  useEffect(() => {
    setStart(String(currentStart ?? MIN_WORD_ID));
    setEnd(String(currentEnd ?? MAX_WORD_ID));
  }, [currentStart, currentEnd]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const numStart = parseInt(start, 10);
    const numEnd = parseInt(end, 10);

    if (isNaN(numStart) || isNaN(numEnd) || numStart < MIN_WORD_ID || numEnd > MAX_WORD_ID || numStart > numEnd) {
      setError(`Invalid range. Start must be >= ${MIN_WORD_ID}, End <= ${MAX_WORD_ID}, and Start <= End.`);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studyRangeStart: numStart, studyRangeEnd: numEnd }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save settings.');
      }

      setSuccessMessage('Range updated successfully!');
      router.refresh(); // Refresh page data to use new range
      // Optionally close modal after a delay or let user close it
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1500);

    } catch (err: unknown) {
        let errorMessage = 'An unexpected error occurred.';
        if (err instanceof Error) { // Type guard
          errorMessage = err.message;
        } else if (typeof err === 'string') {
          errorMessage = err;
        }

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out scale-100 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Set Word Study Range</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            aria-label="Close modal"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div>
              <label htmlFor="startRange" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Start Word (1-{MAX_WORD_ID})
              </label>
              <input
                type="number"
                id="startRange"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                min={MIN_WORD_ID}
                max={MAX_WORD_ID}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-slate-700 dark:text-slate-100"
                required
              />
            </div>
            <span className="text-slate-500 dark:text-slate-400 hidden sm:block mt-6">-</span>
            <div>
              <label htmlFor="endRange" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                End Word (1-{MAX_WORD_ID})
              </label>
              <input
                type="number"
                id="endRange"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                min={MIN_WORD_ID}
                max={MAX_WORD_ID}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-slate-700 dark:text-slate-100"
                required
              />
            </div>
          </div>

          {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}
          {successMessage && <p className="text-sm text-emerald-600 dark:text-emerald-400">{successMessage}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 px-4 py-2.5 bg-pink-600 text-white font-medium rounded-lg shadow-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : <FaSave />}
            {isLoading ? 'Saving...' : 'Save Range'}
          </button>
        </form>
      </div>
    </div>
  );
}