import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        linen: "#F6F1E7",
        walnut: {
          50: "#F3ECE4",
          100: "#E6D6C4",
          300: "#B98F63",
          500: "#8A5A38",
          700: "#5A3A24",
          900: "#2E1D13",
        },
        brass: {
          400: "#C99A47",
          500: "#B8863B",
          600: "#96692B",
        },
        ink: "#241A11",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "wood-grain":
          "repeating-linear-gradient(180deg, rgba(90,58,36,0.04) 0px, rgba(90,58,36,0.04) 2px, transparent 2px, transparent 6px)",
      },
    },
  },
  plugins: [],
};
export default config;
