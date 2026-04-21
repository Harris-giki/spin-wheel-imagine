import type { Config } from "tailwindcss";

/**
 * Palette derived from imagine.art brand:
 *   deep indigo-purple (ImagineArt logo wordmark), lavender/lilac sparkle glow, soft off-white.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Canvas
        canvas: "#f7f5ff", // soft off-white with a violet tint
        surface: "#ffffff",

        // Imagine Art indigo — logo wordmark color
        ink: {
          DEFAULT: "#1f0e47",
          50: "#f2eefb",
          100: "#e4dcf7",
          200: "#c6b5ee",
          300: "#a88de3",
          400: "#8965d7",
          500: "#6a3fcb",
          600: "#4d25ab",
          700: "#371a7f",
          800: "#260f5c",
          900: "#1f0e47",
        },

        // Lilac / lavender — the sparkle glow in the logo
        lilac: {
          DEFAULT: "#a78bfa",
          50: "#f5f1ff",
          100: "#ece3ff",
          200: "#d8c7ff",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
        },

        // Accent highlight — warm lilac pink, used sparingly
        glow: "#e9d5ff",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 20px 60px -20px rgba(31, 14, 71, 0.25), 0 8px 24px -12px rgba(31, 14, 71, 0.12)",
        "card-lg": "0 30px 80px -30px rgba(31, 14, 71, 0.35), 0 12px 32px -16px rgba(31, 14, 71, 0.18)",
        glow: "0 0 40px rgba(167, 139, 250, 0.5)",
        "glow-lg": "0 0 80px rgba(167, 139, 250, 0.55)",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #1f0e47 0%, #371a7f 50%, #6d28d9 100%)",
        "lilac-gradient":
          "linear-gradient(135deg, #c4b5fd 0%, #a78bfa 50%, #7c3aed 100%)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.85)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.15)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.45s ease-out both",
        "pop-in": "pop-in 0.35s cubic-bezier(.2,.9,.3,1.3) both",
        sparkle: "sparkle 2.8s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
