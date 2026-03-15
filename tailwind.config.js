import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dt: {
          bg: '#060608',
          surface: '#0f1014',
          text: '#F4F5F7',
          muted: '#AEB2BE',
          line: '#272932',
          accent: '#FF008C',
          accent2: '#40A9FF',
          cta: '#FF008C',
        },
        energy: {
          via: '#A24CFF',
        },
      },
      boxShadow: {
        soft: '0 8px 24px rgba(0,0,0,.35)',
        'soft-lg': '0 12px 40px rgba(0,0,0,.4)',
        neon: '0 0 22px rgba(255,0,140,.28), 0 0 44px rgba(64,169,255,.18)',
      },
      fontSize: {
        h1: ['3.6rem', { lineHeight: '1.08', fontWeight: '900' }],
        h2: ['2.7rem', { lineHeight: '1.12', fontWeight: '900' }],
        h3: ['1.85rem', { lineHeight: '1.2', fontWeight: '800' }],
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Bebas Neue', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        script: ['Caveat', 'cursive'],
      },
    },
  },
  plugins: [
    plugin(({ addUtilities, theme }) => {
      const from = theme('colors.dt.accent');
      const via = theme('colors.energy.via');
      const to = theme('colors.dt.accent2');

      addUtilities({
        '.heading-gradient': {
          backgroundImage: `linear-gradient(90deg, ${from} 0%, ${via} 45%, ${to} 100%)`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        },
        '.heading-glow': {
          textShadow: '0 2px 14px rgba(64,169,255,.25), 0 6px 28px rgba(255,0,140,.18)',
        },
        '.heading-shadow': {
          textShadow: '0 .06em .24em rgba(0,0,0,.55)',
        },
      });
    }),
  ],
};
