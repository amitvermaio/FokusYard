/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      transitionProperty: {
        'all': 'all',
      },
      animation: {
        'toggle': 'toggle 0.3s ease-in-out',
      },
      keyframes: {
        toggle: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(180deg)' },
        }
      }
    },
  },
  plugins: [],
} 