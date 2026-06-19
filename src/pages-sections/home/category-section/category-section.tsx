"use client"

import { useEffect, useState } from "react"
import NextLink from "next/link"
import Image from "next/image"
import Box from "@mui/material/Box"
import MuiLink from "@mui/material/Link"
import Typography from "@mui/material/Typography"
import ArrowForward from "@mui/icons-material/ArrowForward"
import { BRAND } from "theme/brand"
// GLOBAL CUSTOM COMPONENTS
import Container from "components/Container"
import layoutApi from "@/utils/api/layout"
import { Category } from "@/models/Category.modal"
// STYLED COMPONENTS
import { CategoryGrid, CategoryCard } from "./styles"

// Color + tagline metadata for the known real categories (companyId 155),
// keyed by lowercased name. Unknown categories cycle the fallback palette.
const CATEGORY_META: Record<string, { color: string; bg: string; accent: string; tagline: string }> = {
  grocery: { color: "#15803D", bg: "#E8F5E9", accent: "#16A34A", tagline: "Daily staples, fresh & sealed" },
  "shoes & accessories": { color: "#1D4ED8", bg: "#EFF6FF", accent: "#2563EB", tagline: "Step out in style" },
  "garment & fashion": { color: "#BE185D", bg: "#FDF2F8", accent: "#DB2777", tagline: "Trendy & durable for all ages" }
}

const FALLBACK_META = [
  { color: "#15803D", bg: "#E8F5E9", accent: "#16A34A" },
  { color: "#1D4ED8", bg: "#EFF6FF", accent: "#2563EB" },
  { color: "#BE185D", bg: "#FDF2F8", accent: "#DB2777" },
  { color: "#C2410C", bg: "#FFF7ED", accent: "#EA580C" },
  { color: "#6D28D9", bg: "#F5F3FF", accent: "#7C3AED" }
]

export default function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    layoutApi
      .getCategories()
      .then((data) => setCategories(data || []))
      .catch(() => setCategories([]))
  }, [])

  if (!categories.length) return null

  return (
    <Container sx={{ mt: { xs: 1, sm: 1.5 } }}>
      <Box display="flex" alignItems="flex-end" justifyContent="space-between">
        <Typography variant="h2" fontWeight={800} fontSize={{ sm: 24, xs: 19 }}>
          Shop by Category
        </Typography>

        <MuiLink
          component={NextLink}
          href="/products/search"
          underline="none"
          sx={{
            fontSize: 14,
            fontWeight: 600,
            color: BRAND.primaryDark,
            transition: "color 150ms ease-in-out",
            ":hover": { color: BRAND.primary, textDecoration: "underline" }
          }}
        >
          View all
        </MuiLink>
      </Box>

      <CategoryGrid>
        {categories.map((category, index) => {
          const meta = CATEGORY_META[category.name?.trim().toLowerCase()]
          const fallback = FALLBACK_META[index % FALLBACK_META.length]
          const color = meta?.color ?? fallback.color
          const bg = meta?.bg ?? fallback.bg
          const accent = meta?.accent ?? fallback.accent
          const tagline = meta?.tagline

          return (
            <CategoryCard key={category.id} bg={bg} color={color} accent={accent}>
              <span className="accent-circle" />

              <NextLink href={`/products/search?category=${category.id}`} className="card-head">
                <div className="head-row">
                  <span className="icon-square">
                    {category.iconImage && (
                      <Image
                        src={category.iconImage}
                        alt={category.name}
                        width={28}
                        height={28}
                        style={{ objectFit: "contain" }}
                      />
                    )}
                  </span>

                  <ArrowForward className="arrow" />
                </div>

                <h3 className="card-title">{category.name}</h3>
                {tagline && <p className="tagline">{tagline}</p>}
              </NextLink>

              {category.sub_category && category.sub_category.length > 0 && (
                <div className="pills">
                  {category.sub_category.slice(0, 5).map((sub) => (
                    <NextLink
                      key={sub.id}
                      href={`/products/search?subCategory=${sub.id}`}
                      className="pill"
                    >
                      {sub.name}
                    </NextLink>
                  ))}
                </div>
              )}
            </CategoryCard>
          )
        })}
      </CategoryGrid>
    </Container>
  )
}
