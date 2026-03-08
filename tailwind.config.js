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
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-up': { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
        'fade-in': 'fade-in 0.3s ease-out both',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
