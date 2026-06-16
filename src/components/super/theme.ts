import { ShoppingBasket, Shirt, Footprints, Sparkles, Gift, Watch, type LucideIcon } from "lucide-react"
import { Category } from "@/models/Category.modal"

/**
 * The live category feed (Category.modal) carries no design styling, so we derive a deterministic
 * palette + icon per category by index. This keeps the Super Shopping look (colorful tiles, mega
 * menu accents) while rendering whatever real categories the API returns.
 */
export interface CategoryTheme {
  accent: string
  color: string
  bg: string
  icon: LucideIcon
  tagline: string
}

const PALETTES: Omit<CategoryTheme, "tagline">[] = [
  { accent: "#16A34A", color: "#15803D", bg: "#F0FDF4", icon: ShoppingBasket },
  { accent: "#EA580C", color: "#C2410C", bg: "#FFF7ED", icon: Shirt },
  { accent: "#2563EB", color: "#1D4ED8", bg: "#EFF6FF", icon: Footprints },
  { accent: "#9D174D", color: "#831843", bg: "#FDF2F8", icon: Gift },
  { accent: "#7C3AED", color: "#6D28D9", bg: "#F5F3FF", icon: Sparkles },
  { accent: "#0891B2", color: "#0E7490", bg: "#ECFEFF", icon: Watch }
]

export function categoryTheme(index: number): CategoryTheme {
  const p = PALETTES[index % PALETTES.length]
  return { ...p, tagline: "Explore the collection" }
}

/** Shared shape consumed by the redesigned header + homepage category UI. */
export interface NavCategory {
  id: string
  name: string
  subCategories: { id: string; name: string }[]
  theme: CategoryTheme
}

export function toNavCategories(categories: Category[] = []): NavCategory[] {
  return categories.map((c, i) => ({
    id: c.id,
    name: c.name,
    subCategories: (c.sub_category ?? []).map((s) => ({ id: s.id, name: s.name })),
    theme: categoryTheme(i)
  }))
}
