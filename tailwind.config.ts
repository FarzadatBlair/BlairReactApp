import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFBF2",
        primary: "#514134",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Gentium', 'serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
