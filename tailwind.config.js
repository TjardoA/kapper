/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          beige: '#f5efe6',
          dark: '#1d1a16',
          accent: '#c9a27c',
          pink: '#e4007f',
          soft: '#ede2d3',
        },
      },
      fontFamily: {
        display: ['Arial', 'sans-serif'],
        sans: ['Arial', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 15px 40px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}
