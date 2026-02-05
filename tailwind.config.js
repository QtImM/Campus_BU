/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A8A',
          light: '#3B82F6',
          dark: '#172554',
        },
        accent: {
          DEFAULT: '#39FF14',
          light: '#5FFF4A',
          dark: '#2DB30F',
        },
        background: {
          light: '#F8F8F8',
          dark: '#1A1A1A',
        },
      },
    },
  },
  plugins: [],
};
