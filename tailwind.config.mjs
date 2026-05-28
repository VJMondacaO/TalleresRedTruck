/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts,md}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0B1E3F',
          dark: '#0B1E3F',
          darker: '#061331',
          accent: '#1E3A8A',
          light: '#3B5BA8',
          red: '#C8102E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(11, 30, 63, 0.25)',
      },
    },
  },
  plugins: [],
};
