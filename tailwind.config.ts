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
        background: '#FFFBF2',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Gentium', 'serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
