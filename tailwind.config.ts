import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // "Agent's ledger" — warm paper, ink, estate green. Token names are
        // kept from the previous theme so every page restyles automatically.
        bg: "#F6F2EA",
        surface: "#FDFBF6",
        "surface-2": "#EFE9DD",
        "surface-3": "#E5DDCD",
        text: "#201B12",
        "text-dim": "#5C5343",
        "text-mute": "#958976",
        accent: {
          DEFAULT: "#1F5738",
          2: "#C05B2E",
          3: "#C05B2E",
          soft: "rgba(31,87,56,0.08)",
        },
        border: "#E0D7C6",
        // Remapped default palettes: legacy pages use slate/indigo/violet/pink
        // utility classes — recolor them into the ledger ramps globally.
        slate: {
          50: "#FBFAF5",
          100: "#F1ECE1",
          200: "#E0D7C6",
          300: "#CFC4AE",
          400: "#A79B85",
          500: "#877B66",
          600: "#5C5343",
          700: "#453E32",
          800: "#2E2921",
          900: "#201B12",
          950: "#14100A",
        },
        indigo: {
          50: "#EDF3EC",
          100: "#DCE8DD",
          200: "#BCD3C1",
          300: "#93B8A0",
          400: "#5E9377",
          500: "#357452",
          600: "#1F5738",
          700: "#1A4930",
          800: "#153A27",
          900: "#102C1E",
          950: "#081711",
        },
        violet: {
          50: "#EDF3EC",
          100: "#DCE8DD",
          200: "#BCD3C1",
          300: "#93B8A0",
          400: "#5E9377",
          500: "#357452",
          600: "#1F5738",
          700: "#1A4930",
          800: "#153A27",
          900: "#102C1E",
          950: "#081711",
        },
        purple: {
          50: "#EDF3EC",
          100: "#DCE8DD",
          200: "#BCD3C1",
          300: "#93B8A0",
          400: "#5E9377",
          500: "#357452",
          600: "#1F5738",
          700: "#1A4930",
          800: "#153A27",
          900: "#102C1E",
          950: "#081711",
        },
        pink: {
          50: "#F8EDE6",
          100: "#F1DCCE",
          200: "#E4BFA6",
          300: "#D69F7C",
          400: "#CB7A50",
          500: "#C05B2E",
          600: "#A54B24",
          700: "#853C1E",
          800: "#662E18",
          900: "#482112",
          950: "#2A1209",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["var(--font-mono)", "SFMono-Regular", "Menlo", "monospace"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      borderRadius: {
        card: "6px",
        btn: "4px",
        pill: "2px",
      },
      boxShadow: {
        glow: "0 16px 40px -24px rgba(32,27,18,0.35)",
        card: "0 1px 0 rgba(32,27,18,0.04), 0 12px 32px -20px rgba(32,27,18,0.25)",
        soft: "0 1px 0 rgba(32,27,18,0.05)",
      },
      backgroundImage: {
        // Kept as flat paper tones — no aurora gradients in this theme.
        "radial-aurora": "none",
        "radial-violet": "none",
        "radial-pink": "none",
      },
      animation: {
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        float: "none",
        "fade-up": "fade-up 0.6s ease-out both",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "0.7" },
          "50%": { opacity: "1" },
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
