import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Clean product theme — white, zinc neutrals, one blue accent.
        // Token names are kept so every page restyles automatically.
        bg: "#FFFFFF",
        surface: "#FAFAFA",
        "surface-2": "#F4F4F5",
        "surface-3": "#E4E4E7",
        text: "#09090B",
        "text-dim": "#52525B",
        "text-mute": "#A1A1AA",
        accent: {
          DEFAULT: "#2563EB",
          2: "#1D4ED8",
          3: "#D97706",
          soft: "rgba(37,99,235,0.08)",
        },
        border: "#E4E4E7",
        // Remapped default palettes: legacy pages use slate/indigo/violet/pink
        // utility classes — recolor them into the product ramps globally.
        slate: {
          50: "#FAFAFA",
          100: "#F4F4F5",
          200: "#E4E4E7",
          300: "#D4D4D8",
          400: "#A1A1AA",
          500: "#71717A",
          600: "#52525B",
          700: "#3F3F46",
          800: "#27272A",
          900: "#18181B",
          950: "#09090B",
        },
        indigo: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
          950: "#172554",
        },
        violet: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
          950: "#172554",
        },
        purple: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
          950: "#172554",
        },
        pink: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#D97706",
          600: "#B45309",
          700: "#92400E",
          800: "#78350F",
          900: "#451A03",
          950: "#292008",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "-apple-system", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["var(--font-mono)", "SFMono-Regular", "Menlo", "monospace"],
        display: ["var(--font-sans)", "-apple-system", "Helvetica Neue", "Arial", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        btn: "8px",
        pill: "9999px",
      },
      boxShadow: {
        glow: "0 1px 2px rgba(9,9,11,0.05)",
        card: "0 1px 2px rgba(9,9,11,0.05), 0 8px 24px -12px rgba(9,9,11,0.12)",
        soft: "0 1px 2px rgba(9,9,11,0.05)",
      },
      backgroundImage: {
        "radial-aurora": "none",
        "radial-violet": "none",
        "radial-pink": "none",
      },
      animation: {
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        float: "none",
        "fade-up": "fade-up 0.5s ease-out both",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "0.7" },
          "50%": { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
