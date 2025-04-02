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
        custom: {
          teal: "#476A6F", // Mosgrøn/teal farve
          navy: "#151E3F", // Mørkeblå/navy farve
          light: "#E2E2E2", // Lysegrå farve
          purple: "#9A7AA0", // Lilla farve
          red: "#FB3640", // Rød farve
        },
      },
    },
  },
  plugins: [],
};
export default config;
