import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        brand: {
          DEFAULT: "#00FFC2", // Vibrant Mint for Kache Digital
          80: "rgba(0, 255, 194, 0.8)",
        },
        engineering: "#4F46E5", // Technical Indigo
        surface: {
          100: "#121212",
          200: "#1E1E1E",
        },
      },
    },
  },
  plugins: [],
};
export default config;
