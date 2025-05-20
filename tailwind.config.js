/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif']
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        }
      },
      animation: {
        blink: 'blink 1s steps(2, start) infinite'
      }
    },
  },
  plugins: [],
}

