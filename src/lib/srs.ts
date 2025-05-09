// src/lib/srs.ts
import { WordProgress } from '@prisma/client';

// Define quality ratings (adjust mapping as needed)
// 0: Again (complete failure)
// 1: Hard (difficult recall)
// 2: Good (correct recall with effort)
// 3: Easy (effortless recall)
export type ReviewQuality = 0 | 1 | 2 | 3;

// Interface for the calculation result
interface SrsCalculationResult {
  newLevel: number;
  nextReviewDate: Date;
}

// Function to calculate the next review date based on current progress and review quality
export function calculateSrs(
  progress: Pick<WordProgress, 'level' | 'lastReviewedAt'> | null, // Can be null for first review
  quality: ReviewQuality
): SrsCalculationResult {
  const now = new Date();
  const currentLevel = progress?.level ?? 0; // Default to level 0 if no progress exists

  let newLevel: number;
  let intervalDays: number;

  if (quality < 2) {
    // Quality 0 (Again) or 1 (Hard): Reset level, review soon
    newLevel = 0; // Reset learning phase or keep at lowest level
    intervalDays = 0; // Review again today (or very soon)
  } else {
    // Quality 2 (Good) or 3 (Easy): Advance level
    newLevel = currentLevel + 1;

    // Calculate interval based on new level (simplified exponential backoff)
    // Level 0 -> 1 day
    // Level 1 -> 3 days
    // Level 2 -> 7 days
    // Level 3 -> 14 days
    // Level 4 -> 30 days
    // ... and so on (adjust these intervals as desired)
    switch (newLevel) {
      case 1: intervalDays = 1; break;
      case 2: intervalDays = 3; break;
      case 3: intervalDays = 7; break;
      case 4: intervalDays = 14; break;
      case 5: intervalDays = 30; break;
      case 6: intervalDays = 60; break;
      default: intervalDays = Math.max(90, 60 * Math.pow(1.5, newLevel - 6)); // Cap growth rate after level 6
    }

    // Bonus for "Easy" (quality 3) - add a small percentage to the interval
    if (quality === 3) {
       intervalDays = Math.ceil(intervalDays * 1.3); // e.g., 30% longer interval
    }

  }

  // Calculate the next review date
  const nextReviewDate = new Date(now);
  // Set time to start of day for consistency if interval > 0
  if (intervalDays > 0) {
    nextReviewDate.setHours(0, 0, 0, 0);
  }
  nextReviewDate.setDate(now.getDate() + intervalDays);

  // Ensure next review date is at least a few minutes in the future if interval is 0
  if (intervalDays === 0 && newLevel === 0) {
     nextReviewDate.setMinutes(now.getMinutes() + 5); // e.g., Review again in 5 mins
  }


  return {
    newLevel,
    nextReviewDate,
  };
}

// Helper to get a date for the start of today
export function getStartOfToday(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}