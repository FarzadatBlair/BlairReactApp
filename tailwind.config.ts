import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#514134',
          200: '#D2CDC6',
          300: '#978B80',
          400: '#74665A',
          500: '#514134',
          900: '#30241D',
        },
        brown: {
          500: '#5A2D1B',
          700: '#3E1F12',
        },
        background: {
          DEFAULT: '#FFFBF2',
        },
        secondary: {
          DEFAULT: '#FFD2C5', // default is 300
          100: '#FFF1E7',
          300: '#FFD2C5',
          500: '#D98973',
        },
        error: {
          DEFAULT: '#C9156F',
          100: '#FAD1E6',
          500: '#C9156F',
          700: '#8B0E4D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Gentium', 'serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
