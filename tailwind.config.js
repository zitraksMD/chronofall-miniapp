module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      animation: {
        shimmer: 'shimmer 2s infinite',
        'glow-rare': 'glow 1.5s ease-in-out infinite alternate',
        'glow-mythic': 'glow 1.5s ease-in-out infinite alternate',
        rainbow: 'rainbow 4s linear infinite',
        pulse: 'pulse 2s infinite'
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' }
        },
        glow: {
          '0%': { opacity: 1, filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' },
          '100%': { opacity: 0.7, filter: 'drop-shadow(0 0 10px rgba(255,255,255,1))' }
        },
        'glow-rare': {
          '0%': { opacity: 1, filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' },
          '100%': { opacity: 0.7, filter: 'drop-shadow(0 0 10px rgba(255,255,255,1))' }
        },
        'glow-mythic': {
          '0%': { opacity: 1, filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' },
          '100%': { opacity: 0.7, filter: 'drop-shadow(0 0 10px rgba(255,255,255,1))' }
        },
        rainbow: {
          '0%': { '--tw-gradient': 'red, orange, yellow, green, blue, indigo, violet', backgroundSize: '400% 400%' },
          '100%': { '--tw-gradient': 'violet, indigo, blue, green, yellow, orange, red', backgroundSize: '400% 400%' }
        },
        pulse: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' }
        }
      }
    }
  }
};
