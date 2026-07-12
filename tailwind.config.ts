import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#050A18",        // deep dark blue background
        primaryLight: "#0B1530",   // card background
        accent: "#00D4FF",         // cyan neon
        electric: "#3B82F6",       // electric blue
        signal: "#7DF9FF",         // waveform signal color
        neonGreen: "#39FF14",
        neonPurple: "#B026FF",
        surface: "#040713",        // base page background
        borderSoft: "#1A2645",
      },
      fontFamily: {
        vazir: ["var(--font-vazir)", "sans-serif"],
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": {
            opacity: "1",
            filter: "drop-shadow(0 0 4px currentColor)",
          },
          "50%": {
            opacity: "0.6",
            filter: "drop-shadow(0 0 12px currentColor)",
          },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        dashMove: {
          to: { strokeDashoffset: "-1000" },
        },
      },
      animation: {
        pulseGlow: "pulseGlow 2.5s ease-in-out infinite",
        floatSlow: "floatSlow 6s ease-in-out infinite",
        dashMove: "dashMove 20s linear infinite",
      },
      boxShadow: {
        neon: "0 0 8px rgba(0, 212, 255, 0.6), 0 0 20px rgba(0, 212, 255, 0.3)",
        neonPurple: "0 0 8px rgba(176, 38, 255, 0.6), 0 0 20px rgba(176, 38, 255, 0.3)",
        neonGreen: "0 0 8px rgba(57, 255, 20, 0.6), 0 0 20px rgba(57, 255, 20, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
