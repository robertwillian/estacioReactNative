/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          light: '#554971',
          dark: '#1e201e',
          darken: '#2e283d',
          darkDarken: '#262626'
        },
        primary: '#8ac6d0'
      },
    },
  },
  plugins: [],
}

