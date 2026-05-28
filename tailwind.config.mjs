/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts,md}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0A0A0A',
          dark: '#0A0A0A',
          darker: '#000000',
          surface: '#141414',
          line: '#1F1F1F',
          accent: '#DC2626',
          light: '#EF4444',
          red: '#DC2626',
          redDeep: '#991B1B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 50px -20px rgba(0, 0, 0, 0.75)',
        glow: '0 0 0 1px rgba(220, 38, 38, 0.35), 0 12px 40px -12px rgba(220, 38, 38, 0.45)',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
        'radial-red':
          'radial-gradient(ellipse at top left, rgba(220,38,38,0.18), transparent 60%)',
      },
    },
  },
  plugins: [],
};
