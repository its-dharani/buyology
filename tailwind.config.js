/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pinkPrimary: '#FFB7C5',
        lavender: '#C8B4E3',
        buyGreen: '#86EFAC',
        waitAmber: '#FDE68A',
        skipRose: '#FCA5A5',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}
