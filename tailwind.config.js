/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-sora)', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#0D0D0D',
        mist: '#F5F4F0',
        dot: '#E8341A',
        'dot-soft': '#FDE8E4',
        stone: '#6B6A67',
        border: '#E2E0DA',
      },
      animation: {
        pulse_dot: 'pulse_dot 1.6s ease-in-out infinite',
      },
      keyframes: {
        pulse_dot: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.25)', opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
