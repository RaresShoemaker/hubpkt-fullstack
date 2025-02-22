const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Light mode colors
        light: {
          background: '#ffffff',    // Pure white for main background
          surface: '#f4f6f8',      // Cool grey for secondary background
          accent: '#e11d48',       // Rose red for primary actions
          text: {
            primary: '#334155',    // Dark grey for primary text
            secondary: '#64748b',  // Medium grey for secondary text
            accent: '#e11d48',     // Rose red for accent text
          },
          border: '#e2e8f0',       // Light border color
        },
        // Dark mode colors
        dark: {
          background: '#1a1f24',   // Main dark background
          surface: '#141a1f',      // Darker surface color
          accent: '#00b894',       // Teal accent color
          text: {
            primary: '#e2e8f0',    // Light grey for primary text
            secondary: '#94a3b8',  // Muted grey for secondary text
            accent: '#00b894',     // Teal for accent text
          },
          border: '#2d3436',       // Dark border color
        },
        // Preserve your existing color definitions
        primary: '#0D4AE7',
        secondary: '#848484',
        bg: '#1b215d',
      },
      // Your existing extension configurations
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem'
      },
      backgroundImage: {
        'gradient-custom': 'linear-gradient(180deg, rgba(9, 13, 35, 0.79), rgba(29, 35, 67, 0.79))',
        'gradient-blur': 'linear-gradient(180deg, rgba(44, 74, 194, 0) 0%, rgba(4, 10, 31, 0.8) 55.5%, #000000 100%)',
        'gradient-text-discover': 'linear-gradient(90deg, #FFF 0%, #3CADEF 100%)',
        'gradient-text-hot': 'linear-gradient(90deg, #FFF 0%, #F79422 100%)',
        // Add new gradient utilities for both themes
        'gradient-light': 'linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(244, 246, 248, 0.9))',
        'gradient-dark': 'linear-gradient(180deg, rgba(26, 31, 36, 0.9), rgba(20, 26, 31, 0.9))'
      },
      blur: {
        84: '84.2105px'
      }
    }
  },
  plugins: [
    plugin(function ({ addUtilities, addBase, theme }) {
      // Your existing glass utilities
      addUtilities({
        '.glass': {
          background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.16) 0%, rgba(0, 0, 0, 0.00) 76.61%)',
          'border-radius': '24px 0px 0px 24px',
          'backdrop-filter': 'blur(22px)',
          '-webkit-backdrop-filter': 'blur(22px)'
        },
        '.glass-white': {
          background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.16) 0%, rgba(0, 0, 0, 0.00) 76.61%)',
          'border-radius': '24px',
          'backdrop-filter': 'blur(22px)',
          '-webkit-backdrop-filter': 'blur(22px)'
        },
        '.glass-black': {
          'background': 'rgba(0,0,0,0.2)',
          'box-shadow': '0 4px 30px rgba(0, 0, 0, 0.1)',
          'backdrop-filter': 'blur(7.7px)',
          '-webkit-backdrop-filter': 'blur(7.7px)',
        },
        '.text-gradient': {
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          color: 'transparent'
        },
        // Add new theme-aware glass effects
        '.glass-theme-light': {
          'background': 'rgba(255, 255, 255, 0.7)',
          'border': '1px solid rgba(255, 255, 255, 0.3)',
          'backdrop-filter': 'blur(12px)',
          '-webkit-backdrop-filter': 'blur(12px)',
        },
        '.glass-theme-dark': {
          'background': 'rgba(20, 26, 31, 0.7)',
          'border': '1px solid rgba(45, 52, 54, 0.3)',
          'backdrop-filter': 'blur(12px)',
          '-webkit-backdrop-filter': 'blur(12px)',
        }
      });

      // Add base styles for theme transitions
      addBase({
        'body': {
          transition: 'background-color 0.3s ease-in-out'
        }
      });
    })
  ]
};