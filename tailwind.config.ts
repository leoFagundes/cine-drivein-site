import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0088C2",
        gray: "#4A4A4A",
      },
      backgroundColor: {
        primary: "#E6EFF6",
      },
      backgroundImage: {
        "circular-gradient":
          "radial-gradient(circle, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 70%)",
      },
      boxShadow: {
        card: "2px 2px 8px rgba(0, 0, 0, 0.6)",
      },
      dropShadow: {
        card: "0 4px 50px rgba(0, 0, 0, 0.1)",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
      keyframes: {
        shadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        fadeIn: "shadeIn 0.3s ease-in-out forwards",
        fadeOut: "shadeOut 0.3s ease-in-out forwards",
      },
    },
  },
  plugins: [require("tailwind-hamburgers")],
};

export default config;
