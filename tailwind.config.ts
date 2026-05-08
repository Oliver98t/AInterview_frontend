import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-ring": "pulse-ring 1.5s ease-out infinite",
        "sound-wave": "sound-wave 1.2s ease-in-out infinite alternate",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        "sound-wave": {
          "0%": { height: "4px" },
          "100%": { height: "24px" },
        },
      },
    },
  },
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            background: "#0a0a0f",
            foreground: "#e2e8f0",
            primary: {
              50: "#eff6ff",
              100: "#dbeafe",
              200: "#bfdbfe",
              300: "#93c5fd",
              400: "#60a5fa",
              500: "#3b82f6",
              600: "#2563eb",
              700: "#1d4ed8",
              800: "#1e40af",
              900: "#1e3a8a",
              DEFAULT: "#3b82f6",
              foreground: "#ffffff",
            },
            secondary: {
              50: "#e0e7ff",
              100: "#c7d2fe",
              200: "#a5b4fc",
              300: "#818cf8",
              400: "#6366f1",
              500: "#2563eb",
              600: "#1e40af",
              700: "#1e3a8a",
              800: "#1e3a8a",
              900: "#1e3a8a",
              DEFAULT: "#1e3a8a",
              foreground: "#ffffff",
            },
            success: {
              DEFAULT: "#10b981",
              foreground: "#ffffff",
            },
            warning: {
              DEFAULT: "#f59e0b",
              foreground: "#ffffff",
            },
            danger: {
              DEFAULT: "#ef4444",
              foreground: "#ffffff",
            },
          },
        },
      },
    }),
  ],
};
