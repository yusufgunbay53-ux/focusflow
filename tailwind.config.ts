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
        night: "#0b111e",
        neon: "#00d2ff",
        "neon-dim": "#00a8cc",
        glass: "rgba(11, 17, 30, 0.75)",
      },
      boxShadow: {
        neon: "0 0 15px rgba(0, 210, 255, 0.4)",
        "neon-sm": "0 0 8px rgba(0, 210, 255, 0.3)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;