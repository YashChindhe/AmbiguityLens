/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0a0a0a',
        secondary: '#1a1a1a',
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundColor: {
        glass: 'rgba(255, 255, 255, 0.05)',
        'glass-dark': 'rgba(0, 0, 0, 0.1)',
      },
      borderColor: {
        glass: 'rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: [],
};
