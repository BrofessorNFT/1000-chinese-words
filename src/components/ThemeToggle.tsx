"use client"
 
import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
 
export default function ModeToggle() {
  const { setTheme } = useTheme()
 
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
// // src/components/ThemeToggle.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useTheme } from 'next-themes';
// import { FaSun, FaMoon } from 'react-icons/fa';

// export default function ThemeToggle() {
//   const [mounted, setMounted] = useState(false);
//   const { theme, setTheme, resolvedTheme } = useTheme(); // Get theme functions/state

//   // Ensure component is mounted to avoid hydration mismatch
//   useEffect(() => setMounted(true), []);

//   if (!mounted) {
//     // Render placeholder to match expected size
//     return <div className="w-8 h-8 p-2" />;
//   }

//   // Determine current mode based on resolved theme (handles 'system')
//   const isDarkMode = resolvedTheme === 'dark';

//   const toggleTheme = () => {
//     // Add log to check if function is called
//     console.log("Toggling theme. Current resolved:", resolvedTheme);
//     setTheme(isDarkMode ? 'light' : 'dark'); // Call setTheme to switch
//   };

//   return (
//     <button
//       onClick={toggleTheme} // Make sure onClick is attached
//       className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-500 transition duration-150"
//       aria-label={isDarkMode ? 'Activate light mode' : 'Activate dark mode'}
//       title={isDarkMode ? 'Activate light mode' : 'Activate dark mode'}
//     >
//       {/* Conditionally render Sun or Moon icon */}
//       {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
//     </button>
//   );
// }