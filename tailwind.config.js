/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand:  { DEFAULT: '#1a3c6e', light: '#2a5298', pale: '#e8eef8' },
        accent: { DEFAULT: '#f97316', light: '#fb923c', pale: '#fff7ed' },
        teal:   { DEFAULT: '#0d9488', pale: '#f0fdfa' },
      },
    },
  },
  plugins: [],
}
