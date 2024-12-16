import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'primary-neutral-gray-300': '#a6a6a6',
        'primary-neutral-gray-400': '#8c8c8c',
        'primary-neutral-gray-500': '#666',
        'primary-neutral-gray-600': '#4a4a4a',
        'primary-neutral-gray-700': '#292929',
        'primary-neutral-gray-800': '#1a1a1a',
        'primary-neutral-gray-850': '#0F0F0F',
        'primary-neutral-gray-900': '#0a0a0a',
        crimson: '#dc143c',

      },
    },
  },
  plugins: [],
} satisfies Config;
