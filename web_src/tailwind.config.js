/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
    "!./node_modules/**",
    "!./dist/**"
  ],
  theme: {
    extend: {
      fontFamily: {
        vt323: ['VT323', 'monospace'],
      },
    },
  },
  plugins: [],
}