import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Terminal / trading-desk palette
        base: "#0A0E14", // near-black canvas
        surface: "#0F141C", // panel
        "surface-2": "#141A24", // raised panel
        line: "#1E2733", // hairline borders
        "line-strong": "#2A3543",
        ink: "#E6EDF3", // primary text
        muted: "#8B98A9", // secondary text
        faint: "#5C6675", // tertiary text
        bid: "#26D07C", // green / up / buy
        ask: "#FF5C6C", // red / down / sell
        accent: "#38BDF8", // cyan highlight
        amber: "#F5B14C", // warnings / accents
      },
      fontFamily: {
        sans: ["var(--font-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        shell: "76rem",
      },
      boxShadow: {
        glow: "0 0 24px -4px rgba(56,189,248,0.35)",
        "glow-bid": "0 0 20px -6px rgba(38,208,124,0.45)",
        panel: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 24px 60px -32px rgba(0,0,0,0.8)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        "ping-soft": {
          "0%": { transform: "scale(1)", opacity: "0.55" },
          "75%, 100%": { transform: "scale(2.4)", opacity: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "grid-pan": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "40px 40px" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
        "pulse-dot": "pulse-dot 1.6s ease-in-out infinite",
        "ping-soft": "ping-soft 2.6s cubic-bezier(0,0,0.2,1) infinite",
        marquee: "marquee 32s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
