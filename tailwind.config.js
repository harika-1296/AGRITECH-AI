/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#08160F',
          900: '#102D20',
          800: '#173D2B',
          700: '#1E5238',
          600: '#267348',
          500: '#348155',
          400: '#4C9B64',
          300: '#7BBE8C',
          200: '#B7D96A',
          100: '#D9EBC4',
          50: '#E7F1DF',
        },
        cream: {
          50: '#F8FAF5',
          100: '#F1F6EC',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Sora', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(16,45,32,0.06), 0 8px 24px -8px rgba(16,45,32,0.10)',
        cardLg: '0 2px 6px rgba(16,45,32,0.08), 0 18px 48px -12px rgba(16,45,32,0.18)',
        glow: '0 0 0 1px rgba(183,217,106,0.25), 0 12px 40px -8px rgba(76,155,100,0.35)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.7' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        'wave': {
          '0%, 100%': { transform: 'scaleY(0.35)' },
          '50%': { transform: 'scaleY(1)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'dash': {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'scale-in': 'scale-in 0.35s ease-out both',
        'pulse-ring': 'pulse-ring 1.8s cubic-bezier(0.4,0,0.2,1) infinite',
        'wave': 'wave 1s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'dash': 'dash 1.2s ease-out forwards',
      },
    },
  },
  plugins: [],
};
