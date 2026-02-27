/** @type {import('tailwindcss').Config} */
module.exports = {
  // Intentional slight misconfiguration: misses nested src folders
  content: ['./src/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
