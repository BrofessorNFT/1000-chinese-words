// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/styles/globals.css', 
  ],
  darkMode: 'class', // <<<--- CRITICAL: Ensure this is 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      // Add other extensions if you have them
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;