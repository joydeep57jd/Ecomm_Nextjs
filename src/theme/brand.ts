/**
 * BRAND CONFIGURATION
 *
 * Change the values here to restyle the entire app.
 * All components import from this file — no hunting for hardcoded hex values.
 */

import { orange, secondary } from "./core/theme-colors"

export const BRAND = {
  // ─── Page background ────────────────────────────────────────────────────────
  /** The main page/site background. */
  pageBg: orange[50],

  // ─── Primary / button color ─────────────────────────────────────────────────
  /** Main CTA color used for buttons, accents, and icons. */
  primary: orange.main,
  /** Darker shade for hover states and "Buy Now"-style CTAs. */
  primaryDark: orange.dark,
  /** Soft background tint for outlined/ghost button variants. */
  primaryLight: orange[50],
  /** Border color for ghost/outlined buttons. */
  primaryBorder: orange[200],
  /** Text on top of a primary-colored surface. */
  primaryContrast: orange.contrastText,

  // ─── Step / section-number badges ───────────────────────────────────────────
  /** Background of numbered step badges (e.g. "1 Delivery Address" in checkout). */
  stepBadge: secondary.main,
  /** Text/icon color on top of the step badge. */
  stepBadgeContrast: "#FFFFFF",

  // ─── Store / brand label ────────────────────────────────────────────────────
  /** The small uppercase store-name label shown on product pages. */
  storeLabel: orange.dark,
} as const

export type BrandColors = typeof BRAND
