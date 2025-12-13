
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        mono: ['Fira Code', 'monospace'],
      },
      colors: {
        brand: {
          50: '#FFF1EE',
          100: '#FFDFD9',
          200: '#FFC0B3',
          300: '#FF9B87',
          400: '#FF6D52',
          500: '#F54518', // Firecrawl Orange
          600: '#D93208',
          700: '#B32605',
          800: '#8E1E04',
          900: '#6B1703',
        },
        slate: {
          850: '#151F32', 
          900: '#0F172A',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #f3f4f6 1px, transparent 1px), linear-gradient(to bottom, #f3f4f6 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}
