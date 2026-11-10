/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        revolt: { // legacy reference
          dark: '#0a0d14',
          card: '#121622',
        },
        native: {
          bg: '#080a10',
          surface: '#111522',
          surfaceLight: '#181f33',
          card: '#131826',
          border: '#1f273d',
          accent: '#2563eb', // electric cobalt
          accentGlow: '#3b82f6',
          cyan: '#06b6d4',
          emerald: '#10b981',
          gold: '#f59e0b',
          purple: '#8b5cf6',
          textMuted: '#94a3b8',
          textDim: '#64748b'
        }
      },
      fontFamily: {
        sans: [
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif'
        ]
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glow: {
          '0%': { filter: 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 25px rgba(59, 130, 246, 0.8))' },
        }
      }
    },
  },
  plugins: [],
}

