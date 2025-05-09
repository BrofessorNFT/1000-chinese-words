// src/components/Flashcard.tsx
'use client';

import React, { useState, useEffect, useTransition, useRef } from 'react';
import { WordWithExamples } from '@/lib/prisma';
import { useRouter } from 'next/navigation';
import { FaVolumeUp, FaSpinner } from 'react-icons/fa'; // Assuming react-icons installed

interface FlashcardProps {
  word: WordWithExamples;
}

// Define quality ratings mapping - Semantic info only
const reviewQualities = [
    { label: "Again", value: 0, baseColorName: "rose" },
    { label: "Hard", value: 1, baseColorName: "amber" },
    { label: "Good", value: 2, baseColorName: "emerald" },
    { label: "Easy", value: 3, baseColorName: "sky" },
];
type ReviewQualityValue = 0 | 1 | 2 | 3;

// Helper function V2: Generates button classes with improved contrast/style
const getButtonClassesV2 = (colorName: string, isSubmitting: boolean): string => {
    const common = "w-full px-4 py-3 text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition duration-150 ease-in-out"; // Pink focus ring
    const disabled = isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:brightness-110 dark:hover:brightness-125'; // Use brightness on hover

    // Define light and dark themes for each color - focusing on contrast
    const themes: Record<string, { lightBg: string, lightText: string, darkBg: string, darkText: string }> = {
        rose: {
            lightBg: "bg-rose-50", lightText: "text-rose-700",
            darkBg: "dark:bg-rose-900/50", darkText: "dark:text-rose-200", // Use semi-transparent dark bg
        },
        amber: {
            lightBg: "bg-amber-50", lightText: "text-amber-700",
            darkBg: "dark:bg-amber-900/50", darkText: "dark:text-amber-200",
        },
        emerald: {
            lightBg: "bg-emerald-50", lightText: "text-emerald-700",
            darkBg: "dark:bg-emerald-900/50", darkText: "dark:text-emerald-200",
        },
        sky: {
            lightBg: "bg-sky-50", lightText: "text-sky-700",
            darkBg: "dark:bg-sky-900/50", darkText: "dark:text-sky-200",
        },
    };

    const theme = themes[colorName] || themes.sky;

    return `${common} ${theme.lightBg} ${theme.lightText} ${theme.darkBg} ${theme.darkText} ${disabled}`;
};


const Flashcard: React.FC<FlashcardProps> = ({ word }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showDetails, setShowDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => { /* ... same effect code ... */
    if (!isPending) {
        setShowDetails(false); setIsSubmitting(false); setIsPlaying(false);
        if (audioRef.current) { audioRef.current.pause(); audioRef.current.onended = null; audioRef.current.onerror=null; audioRef.current.onplay=null; audioRef.current = null; }
    }
  }, [word.id, isPending]);

  const handleReveal = () => { setShowDetails(true); };
  const playAudio = () => { /* ... same function code ... */
     if (!word.audio_url || isPlaying) return;
     if (!audioRef.current || audioRef.current.src !== word.audio_url) {
        if (audioRef.current) { audioRef.current.pause(); /*...cleanup...*/ }
        audioRef.current = new Audio(word.audio_url);
        audioRef.current.onplay = () => setIsPlaying(true); audioRef.current.onended = () => setIsPlaying(false);
        audioRef.current.onerror = (e) => { console.error("Audio error:", e); setError("Audio playback error."); setIsPlaying(false); };
     }
     audioRef.current.play().catch(err => { console.error("Audio play failed:", err); setError("Playback failed."); setIsPlaying(false); });
   };
  const handleReview = async (quality: ReviewQualityValue) => { /* ... same function code ... */
    if (!word || isSubmitting || isPending) return; setIsSubmitting(true); setError(null); if (audioRef.current) audioRef.current.pause();
    try {
      const requestBody = { wordId: word.id, quality: quality };
      const response = await fetch('/api/user/progress', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(requestBody)});
      setIsSubmitting(false);
      if (!response.ok) { /* ... error handling ... */ throw new Error(/*...*/); }
      startTransition(() => { router.refresh(); });
    } catch (err: any) { /* ... error handling ... */ setIsSubmitting(false); }
   };

  // --- Loading State ---
  if (isPending) {
    return (
      <div className="p-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center justify-center min-h-[450px]"> {/* Adjusted min-height */}
        <FaSpinner className="animate-spin h-10 w-10 text-pink-500 dark:text-pink-400" /> {/* Pink spinner */}
      </div>
    );
  }

  // --- Main Card Rendering ---
  return (
    // Card: Semi-transparent bg on light mode, blurred backdrop, larger padding, rounded, shadow
    <div className="p-10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-slate-800/50 space-y-8"> {/* Glassmorphism attempt */}

      {/* Word Section */}
      <div className="text-center flex items-center justify-center gap-4">
        {/* Hanzi: Elegant weight, color, spacing */}
        <h2 className="text-6xl sm:text-7xl font-medium text-slate-900 dark:text-white tracking-wider">{word.hanzi}</h2>
        {/* Audio Button: Minimalist */}
        {word.audio_url && (
           <button
             onClick={playAudio}
             disabled={isPlaying}
             title="Play audio"
             className={`p-2.5 rounded-full transition duration-150 ease-in-out ${
               isPlaying
                 ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed'
                 : 'text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
           >
             <FaVolumeUp size={20} />
           </button>
         )}
      </div>

      {/* Pinyin: Lighter color */}
      <div className="text-center">
        <p className="text-xl text-slate-500 dark:text-slate-400">{word.pinyin}</p>
      </div>

      {/* Divider or Reveal Button */}
      {!showDetails ? (
        <div className="text-center pt-5 pb-3">
          {/* Reveal Button: Ghost style */}
          <button
            onClick={handleReveal}
            className="px-6 py-2.5 text-sm font-medium text-pink-600 dark:text-pink-400 rounded-full hover:bg-pink-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition" // Pink text/focus, subtle bg hover
          >
            Show Details
          </button>
        </div>
      ) : (
        // Divider: Lighter, increased margin
        <hr className="border-slate-200 dark:border-slate-700 my-8" />
      )}

      {/* Details Section */}
      {showDetails && (
        <div className="space-y-8 transition-opacity duration-300 ease-in-out opacity-100">
          {/* Translation */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-widest">Translation</h3>
            <p className="text-lg text-slate-700 dark:text-slate-300">{word.translation_en}</p>
          </div>
          {/* Examples */}
          {word.exampleSentences.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-widest">Examples</h3>
              <ul className="space-y-4">
                {word.exampleSentences.map((sentence) => (
                  <li key={sentence.id} className="text-base text-slate-600 dark:text-slate-400 pl-3 border-l-2 border-pink-200 dark:border-pink-800/50"> {/* Pink accent border */}
                    <p className="font-normal">{sentence.sentence_hanzi}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* SRS Interaction Buttons */}
          <div className="pt-6">
            <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">Recall difficulty?</p>
            {error && <p className="text-center text-sm text-rose-600 dark:text-rose-400 mb-3">Error: {error}</p>}
            {/* Use V2 helper function for button classes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {reviewQualities.map((quality) => (
                <button
                  key={quality.value}
                  onClick={() => handleReview(quality.value as ReviewQualityValue)}
                  disabled={isSubmitting}
                  className={getButtonClassesV2(quality.baseColorName, isSubmitting)} // Use V2 helper
                >
                  {quality.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcard;
// // src/components/Flashcard.tsx
// 'use client';

// import React, { useState, useEffect, useTransition, useRef } from 'react';
// import { WordWithExamples } from '@/lib/prisma';
// import { useRouter } from 'next/navigation';
// import { FaVolumeUp, FaSpinner } from 'react-icons/fa';

// interface FlashcardProps {
//   word: WordWithExamples;
// }

// // Define quality ratings mapping - Only semantic info needed now
// const reviewQualities = [
//     { label: "Again", value: 0, baseColorName: "rose" }, // Use names for mapping
//     { label: "Hard", value: 1, baseColorName: "amber" },
//     { label: "Good", value: 2, baseColorName: "emerald" },
//     { label: "Easy", value: 3, baseColorName: "sky" },
// ];
// type ReviewQualityValue = 0 | 1 | 2 | 3;

// // Helper function to generate button classes based on theme and color name
// const getButtonClasses = (colorName: string, isSubmitting: boolean): string => {
//     const common = "w-full px-3 py-3 text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition duration-150 ease-in-out";
//     const disabled = isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90';

//     // Define light and dark themes for each color
//     const themes: Record<string, { light: string, dark: string, ring: string }> = {
//         rose: {
//             light: "bg-rose-100 text-rose-800 hover:bg-rose-200",
//             dark: "bg-rose-800 text-rose-100 hover:bg-rose-700",
//             ring: "focus:ring-rose-500"
//         },
//         amber: {
//             light: "bg-amber-100 text-amber-800 hover:bg-amber-200",
//             dark: "bg-amber-700 text-amber-100 hover:bg-amber-600", // Adjusted dark amber
//             ring: "focus:ring-amber-500"
//         },
//         emerald: {
//             light: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
//             dark: "bg-emerald-700 text-emerald-100 hover:bg-emerald-600", // Adjusted dark emerald
//             ring: "focus:ring-emerald-500"
//         },
//         sky: {
//             light: "bg-sky-100 text-sky-800 hover:bg-sky-200",
//             dark: "bg-sky-700 text-sky-100 hover:bg-sky-600", // Adjusted dark sky
//             ring: "focus:ring-sky-500"
//         },
//     };

//     const theme = themes[colorName] || themes.sky; // Default to sky if colorName is invalid

//     // Combine classes using dark: prefix for dark mode overrides
//     return `${common} ${theme.light} dark:${theme.dark} ${theme.ring} ${disabled}`;
// };


// const Flashcard: React.FC<FlashcardProps> = ({ word }) => {
//   const router = useRouter();
//   const [isPending, startTransition] = useTransition();
//   const [showDetails, setShowDetails] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const audioRef = useRef<HTMLAudioElement | null>(null);
//   const [isPlaying, setIsPlaying] = useState(false);

//   // Effect to reset states
//   useEffect(() => { /* ... same effect code as before ... */
//     if (!isPending) {
//         setShowDetails(false);
//         setIsSubmitting(false);
//         setIsPlaying(false);
//         if (audioRef.current) {
//             audioRef.current.pause();
//             audioRef.current.onended = null;
//             audioRef.current.onerror = null;
//             audioRef.current.onplay = null;
//             audioRef.current = null;
//         }
//     }
//   }, [word.id, isPending]);

//   const handleReveal = () => { setShowDetails(true); };

//   // --- Play Audio Function (no style changes needed) ---
//   const playAudio = () => { /* ... same function code as before ... */
//      if (!word.audio_url || isPlaying) return;
//      if (!audioRef.current || audioRef.current.src !== word.audio_url) {
//         if (audioRef.current) { audioRef.current.pause(); audioRef.current.onended = null; audioRef.current.onerror = null; audioRef.current.onplay = null; }
//         audioRef.current = new Audio(word.audio_url);
//         audioRef.current.onplay = () => setIsPlaying(true);
//         audioRef.current.onended = () => setIsPlaying(false);
//         audioRef.current.onerror = (e) => { console.error("Audio error:", e); setError("Audio playback error."); setIsPlaying(false); };
//      }
//      audioRef.current.play().catch(err => { console.error("Audio play failed:", err); setError("Playback failed."); setIsPlaying(false); });
//   };

//   // --- Handle Review Function (no style changes needed) ---
//   const handleReview = async (quality: ReviewQualityValue) => { /* ... same function code as before ... */
//     if (!word || isSubmitting || isPending) return;
//     setIsSubmitting(true);
//     setError(null);
//     if (audioRef.current) audioRef.current.pause();

//     try {
//       const requestBody = { wordId: word.id, quality: quality };
//       const response = await fetch('/api/user/progress', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(requestBody)});
//       setIsSubmitting(false);
//       if (!response.ok) {
//         let errorData = { error: `API Error ${response.status}: ${response.statusText}` };
//         try { errorData = await response.json(); } catch { /* ignore */ }
//         throw new Error(errorData.error || `API Error: ${response.statusText}`);
//       }
//       startTransition(() => { router.refresh(); });
//     } catch (err: any) {
//       console.error("Error in handleReview:", err);
//       setError(err.message || "An error occurred.");
//       setIsSubmitting(false);
//     }
//   };

//   // --- Loading State Spinner ---
//   if (isPending) {
//     return ( // Match card style but just show spinner
//       <div className="p-10 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center justify-center min-h-[420px]"> {/* Adjusted padding, bg, border, rounding */}
//         <FaSpinner className="animate-spin h-10 w-10 text-sky-500 dark:text-sky-400" />
//       </div>
//     );
//   }

//   // --- Main Card Rendering ---
//   return (
//     // Card: White/Dark bg, rounded, larger shadow, subtle border, increased padding
//     <div className="p-10 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 space-y-8"> {/* Increased rounding, shadow, padding, space */}

//       {/* Word Section */}
//       <div className="text-center flex items-center justify-center gap-4">
//         {/* Hanzi: Darker text, larger, generous tracking */}
//         <h2 className="text-6xl sm:text-7xl font-medium text-slate-900 dark:text-white tracking-wider">{word.hanzi}</h2>
//         {/* Audio Button: Very subtle grey */}
//         {word.audio_url && (
//            <button
//              onClick={playAudio}
//              disabled={isPlaying}
//              title="Play audio"
//              className={`p-2.5 rounded-full transition duration-150 ease-in-out ${
//                isPlaying
//                  ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed'
//                  : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800' // Adjusted colors
//               }`}
//            >
//              <FaVolumeUp size={20} /> {/* Consistent size */}
//            </button>
//          )}
//       </div>

//       {/* Pinyin: Lighter grey, medium size */}
//       <div className="text-center">
//         <p className="text-xl text-slate-500 dark:text-slate-400">{word.pinyin}</p>
//       </div>

//       {/* Divider or Reveal Button */}
//       {!showDetails ? (
//         <div className="text-center pt-5 pb-3">
//           {/* Reveal Button: Minimalist - light grey/white, dark text */}
//           <button
//             onClick={handleReveal}
//             className="px-6 py-2.5 text-sm font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-full shadow-sm border border-transparent hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 transition" // Pink accent on focus
//           >
//             Show Details
//           </button>
//         </div>
//       ) : (
//         // Divider: Very subtle
//         <hr className="border-slate-100 dark:border-slate-800 my-8" />
//       )}

//       {/* Details Section */}
//       {showDetails && (
//         <div className="space-y-8 transition-opacity duration-300 ease-in-out opacity-100">
//           {/* Translation */}
//           <div>
//             <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-widest">Translation</h3> {/* More subtle heading */}
//             <p className="text-lg text-slate-700 dark:text-slate-300">{word.translation_en}</p>
//           </div>
//           {/* Examples */}
//           {word.exampleSentences.length > 0 && (
//             <div>
//               <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-widest">Examples</h3>
//               <ul className="space-y-4">
//                 {word.exampleSentences.map((sentence) => (
//                   <li key={sentence.id} className="text-base text-slate-600 dark:text-slate-400 pl-3 border-l-2 border-slate-200 dark:border-slate-700"> {/* Adjusted border color */}
//                     <p className="font-normal">{sentence.sentence_hanzi}</p> {/* Normal weight for example */}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//           {/* SRS Interaction Buttons */}
//           <div className="pt-6"> {/* Added padding top */}
//             <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">Recall difficulty?</p> {/* Changed prompt slightly */}
//             {error && <p className="text-center text-sm text-rose-600 dark:text-rose-400 mb-3">Error: {error}</p>}
//             {/* Use helper function for button classes */}
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//               {reviewQualities.map((quality) => (
//                 <button
//                   key={quality.value}
//                   onClick={() => handleReview(quality.value as ReviewQualityValue)}
//                   disabled={isSubmitting}
//                   // Apply classes generated by the helper function
//                   className={getButtonClasses(quality.baseColorName, isSubmitting)}
//                 >
//                   {quality.label}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Flashcard;