import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Light theme — mirrors the production mobile app (theme/themes.ts → lightTheme)
        bg: "#F8FAFC",
        surface: "#FFFFFF",
        "surface-2": "#F1F5F9",
        "surface-3": "#E2E8F0",
        text: "#0F172A",
        "text-dim": "#475569",
        "text-mute": "#94A3B8",
        accent: {
          DEFAULT: "#6366F1",
          2: "#8B5CF6",
          3: "#EC4899",
          soft: "rgba(99,102,241,0.12)",
        },
        border: "rgba(15,23,42,0.06)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Inter",
          "Segoe UI",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        card: "28px",
        btn: "14px",
        pill: "9999px",
      },
      boxShadow: {
        glow: "0 30px 80px -20px rgba(99,102,241,0.28)",
        card:
          "0 1px 0 rgba(255,255,255,0.8) inset, 0 24px 50px -30px rgba(15,23,42,0.18)",
        soft: "0 8px 30px -12px rgba(15,23,42,0.12)",
      },
      backgroundImage: {
        "radial-aurora":
          "radial-gradient(1200px 600px at 50% -100px, rgba(99,102,241,0.14), transparent 60%)",
        "radial-violet":
          "radial-gradient(900px 500px at 80% 20%, rgba(139,92,246,0.10), transparent 60%)",
        "radial-pink":
          "radial-gradient(700px 500px at 15% 85%, rgba(236,72,153,0.08), transparent 60%)",
      },
      animation: {
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "fade-up": "fade-up 0.6s ease-out both",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "0.8" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
