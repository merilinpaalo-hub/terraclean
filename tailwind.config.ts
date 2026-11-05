import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#15803d", foreground: "#ffffff", soft: "#f0fdf4" },
      },
      borderRadius: { lg: "0.75rem" },
      boxShadow: { soft: "0 1px 3px rgba(15,23,42,0.06), 0 4px 14px rgba(15,23,42,0.06)" },
    },
  },
  plugins: [animate],
};
export default config;
