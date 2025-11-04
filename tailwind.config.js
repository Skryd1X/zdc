/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dt: {
          bg: '#0D0E10',
          surface: '#121318',
          text: '#E6E7EB',
          muted: '#A5A7B1',
          line: '#272932',
          accent: '#7D5CFA',
          accent2: '#0FD2C8',
          cta: '#6E56CF',
        },
      },
      boxShadow: {
        soft: '0 8px 24px rgba(0,0,0,.35)',
        'soft-lg': '0 12px 40px rgba(0,0,0,.4)',
      },
      fontSize: {
        'h1': ['3.5rem', { lineHeight: '1.1', fontWeight: '900' }],
        'h2': ['2.5rem', { lineHeight: '1.2', fontWeight: '900' }],
        'h3': ['1.75rem', { lineHeight: '1.3', fontWeight: '700' }],
      },
    },
  },
  plugins: [],
};
