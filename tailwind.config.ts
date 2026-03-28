import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2D6A4F",
          dark:    "#1B4332",
          light:   "#D8F3DC",
          muted:   "#95D5B2",
        },
      },
    },
  },
  plugins: [],
};

export default config;