/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        brand: {
          50:  '#eef5ff',
          100: '#d9e8ff',
          200: '#bcd6ff',
          300: '#8ebbff',
          400: '#5895ff',
          500: '#2f6fff',
          600: '#1a52f0',
          700: '#1640c2',
          800: '#173799',
          900: '#16327a'
        },
        accent: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c'
        }
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 24, 40, 0.05), 0 1px 3px rgba(16, 24, 40, 0.08)',
        soft: '0 4px 12px rgba(16, 24, 40, 0.06)',
        lift: '0 12px 32px -10px rgba(16, 24, 40, 0.18)'
      },
      keyframes: {
        pop: {
          '0%':   { transform: 'scale(0.92)', opacity: '0' },
          '60%':  { transform: 'scale(1.04)', opacity: '1' },
          '100%': { transform: 'scale(1)',    opacity: '1' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.55' }
        }
      },
      animation: {
        pop: 'pop 0.45s ease-out',
        pulseSoft: 'pulseSoft 1.6s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
