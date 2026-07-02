import { getItem, setItem } from "./local-storage.service"

// Per-business-unit colors (e.g. "Fashion" -> pink bg + maroon font).
//
// These colors are a server-side, per-unit attribute. The logged-in cart gets
// them back from the cart API (RemoteCart), but several product endpoints used
// for guests (home page / categories) DON'T return them. To keep the cart tabs
// consistently coloured for guests, we remember each unit's colors whenever we
// DO see them (search/listing pages, product details) and reuse them as a
// fallback when a cart item itself is missing the colors.

const KEY = "unit_colors"

export type UnitColor = { bg: string; font: string }
export type UnitColorMap = Record<string, UnitColor>

export const getUnitColorMap = (): UnitColorMap => {
  const data = getItem(KEY)
  return data && typeof data === "object" ? (data as UnitColorMap) : {}
}

export const getUnitColors = (unitName?: string | null): UnitColor | undefined => {
  if (!unitName) return undefined
  return getUnitColorMap()[unitName]
}

/** Remember a unit's colors. No-op if anything is missing or unchanged. */
export const rememberUnitColors = (
  unitName?: string | null,
  backgroundColor?: string | null,
  fontColor?: string | null
) => {
  if (!unitName || !backgroundColor || !fontColor) return
  const map = getUnitColorMap()
  const existing = map[unitName]
  if (existing && existing.bg === backgroundColor && existing.font === fontColor) return
  map[unitName] = { bg: backgroundColor, font: fontColor }
  setItem(KEY, map)
}

/** Remember colors for a list of products (used on listing pages). */
export const rememberUnitColorsFromList = (
  products: { unitName?: string | null; backgroundColor?: string | null; fontColor?: string | null }[]
) => {
  products.forEach((p) => rememberUnitColors(p.unitName, p.backgroundColor, p.fontColor))
}
