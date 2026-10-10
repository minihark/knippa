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
        ledger: {
          950: '#080A0D',
          900: '#0D1016',
          850: '#12161F',
          800: '#171D28',
          750: '#1E2533',
          700: '#252E3F',
          600: '#344057',
          500: '#4B5B7A',
          400: '#7588AC',
          300: '#A4B4CF',
          200: '#D0D9E7',
          100: '#F0F4FA',
        },
        brass: {
          DEFAULT: '#E5A93C',
          50: '#FDF8EC',
          100: '#FBF0D5',
          200: '#F7DFAB',
          300: '#F3CE81',
          400: '#EEBD57',
          500: '#E5A93C',
          600: '#C78C23',
          700: '#9B6B18',
          800: '#6F4B0E',
          900: '#432C06',
        },
        cyan: {
          glow: '#00E5FF',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        serif: ['"Newsreader"', 'serif'],
      },
      boxShadow: {
        'cassette': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 2px 6px -1px rgba(0, 0, 0, 0.3)',
        'slot': 'inset 0 2px 4px rgba(0, 0, 0, 0.4), 0 1px 0 rgba(255, 255, 255, 0.04)',
        'amber-glow': '0 0 25px -4px rgba(229, 169, 60, 0.35)',
        'cyan-glow': '0 0 25px -4px rgba(0, 229, 255, 0.35)',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
