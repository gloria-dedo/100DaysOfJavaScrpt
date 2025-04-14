/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.{html,js}",
    "./dist/*.{html,js}",
    "./src/**/*.{html,js}",

  ],
  darkMode: 'selector',
  theme: {
    extend: {
      keyframes: {
        fade: {
          from: { opacity: '0.4' },
          to: { opacity: '1' },
        },
      },
      animation: {
        fade: 'fade 1.5s ease-in-out',
      },
    },
  },
  plugins: [],
}

