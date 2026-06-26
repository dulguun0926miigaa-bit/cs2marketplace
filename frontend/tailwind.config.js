/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        loot: {
          bg: '#0a0a0a',
          surface: '#111111',
          card: '#161616',
          border: '#2a2a2a',
          muted: '#888888',
          text: '#ffffff',
          accent: '#e8e8e8',
          gold: '#f5c518',
          cyan: '#00d4ff',
        },
        rarity: {
          consumer: '#b0c3d9',
          industrial: '#5e98d9',
          mil: '#4b69ff',
          restricted: '#8847ff',
          classified: '#d32ce6',
          covert: '#eb4b4b',
          gold: '#f5c518',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
