import type { Config } from "tailwindcss"

/**
 * Tailwind is used ONLY for the "Super Shopping" redesigned surfaces (homepage + header/menu).
 * Preflight is disabled so Tailwind's global reset never fights the existing MUI/Emotion styles —
 * every other page keeps rendering exactly as before. New components opt in via utility classes.
 */
const config: Config = {
  // Only scan the redesigned surfaces so MUI markup is never touched by JIT.
  content: [
    "./src/components/super/**/*.{ts,tsx}",
    "./src/pages-sections/home/**/*.{ts,tsx}"
  ],
  corePlugins: {
    preflight: false
  },
  /*
   * The Bazaar theme injects global utility classes (.p-4, .mt-3, … = Nrem) via MUI GlobalStyles,
   * which collide with Tailwind's same-named utilities. Scoping every Tailwind utility under
   * `.tw-scope` raises its specificity (.tw-scope .p-4) so it always wins inside our surfaces,
   * without adding !important and without affecting any MUI page.
   */
  important: ".tw-scope",
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", lg: "1.5rem" },
      screens: { "2xl": "1280px" }
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: "#EA580C",
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
          700: "#C2410C",
          900: "#7C2D12"
        },
        fresh: {
          DEFAULT: "#16A34A",
          50: "#F0FDF4",
          100: "#DCFCE7",
          600: "#16A34A",
          700: "#15803D"
        },
        festive: {
          DEFAULT: "#9D174D",
          50: "#FDF2F8",
          600: "#9D174D",
          700: "#831843"
        },
        ink: "#0F172A",
        muted: "#64748B",
        line: "#E5E7EB",
        surface: "#FFFFFF",
        canvas: "#FFF9F3",
        danger: "#DC2626"
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }]
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem"
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,23,42,0.04), 0 4px 16px rgba(15,23,42,0.06)",
        "card-hover": "0 6px 14px rgba(234,88,12,0.10), 0 12px 28px rgba(15,23,42,0.10)",
        pop: "0 12px 40px rgba(15,23,42,0.16)"
      },
      keyframes: {
        shimmer: { "100%": { transform: "translateX(100%)" } }
      },
      animation: {
        shimmer: "shimmer 1.4s infinite"
      }
    }
  },
  plugins: []
}

export default config
