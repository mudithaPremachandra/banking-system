/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19', // Keeping banking dark
        banking: {
          green: '#10b981',
          light: '#34d399',
          dark: '#059669',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.4)',
          border: 'rgba(255, 255, 255, 0.15)'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
        huge: '64px',
      }
    },
  },
  plugins: [],
}
