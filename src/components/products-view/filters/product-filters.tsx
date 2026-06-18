"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
// MUI
import Box from "@mui/material/Box"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import Checkbox from "@mui/material/Checkbox"
import FormGroup from "@mui/material/FormGroup"
import Typography from "@mui/material/Typography"
import FormControlLabel from "@mui/material/FormControlLabel"
import Button from "@mui/material/Button"
// TYPES + API
import { Category, SubCategory } from "@/models/Category.modal"
import { GetCategoryResponse } from "@/models/Category.modal"

interface Props {
  categories: Category[]
  categoryOptions: GetCategoryResponse[]
  priceFilters: Record<string, number>
}

const CATEGORY_DOT: Record<string, string> = {
  grocery: "#16A34A",
  "shoes & accessories": "#2563EB",
  "garment & fashion": "#DB2777"
}
const FALLBACK_DOTS = ["#16A34A", "#2563EB", "#DB2777", "#EA580C", "#7C3AED"]

const PRICE_RANGES = [
  { label: "Under ₹100", min: 0, max: 100 },
  { label: "₹100 – ₹500", min: 100, max: 500 },
  { label: "₹500 – ₹1,000", min: 500, max: 1000 },
  { label: "Over ₹1,000", min: 1000, max: 100000 }
]

const SECTION_HEADING = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: 0.6,
  textTransform: "uppercase" as const,
  color: "grey.500",
  mb: 0.5
}

// Decode a base64-encoded filter param into { optionName: [ids] }
const decodeFilterMap = (encoded: string | null): Record<string, number[]> => {
  if (!encoded) return {}
  try {
    const parsed = JSON.parse(atob(encoded)) as Record<string, Record<string, number[]>>
    return Object.values(parsed).reduce(
      (acc, group) => ({ ...acc, ...group }),
      {} as Record<string, number[]>
    )
  } catch {
    return {}
  }
}

// Encode { optionName: [ids] } back to a base64 param string
const encodeFilterMap = (map: Record<string, number[]>): string => btoa(JSON.stringify({ f: map }))

export default function ProductFilters({ categories, categoryOptions }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const selectedCategory = searchParams.get("category") ?? "all"
  const selectedSubCategory = searchParams.get("subCategory") ?? "all"

  const decodedPrice = (() => {
    const price = searchParams.get("price")
    if (!price) return ""
    try {
      const [min, max] = JSON.parse(atob(price))
      return `${min}-${max}`
    } catch {
      return ""
    }
  })()

  const selectedBrands: number[] = (() => {
    const brand = searchParams.get("brand")
    if (!brand) return []
    try {
      return JSON.parse(atob(brand))
    } catch {
      return []
    }
  })()

  // Decoded variant option selections from URL
  const currentFilterMap = decodeFilterMap(searchParams.get("filter"))
  const currentVariantFilterMap = decodeFilterMap(searchParams.get("variantFilter"))

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedSubCategory !== "all" ||
    !!decodedPrice ||
    selectedBrands.length > 0 ||
    Object.keys(currentFilterMap).length > 0 ||
    Object.keys(currentVariantFilterMap).length > 0

  const pushParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString())
    mutate(params)
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleClearAll = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("category")
    params.delete("subCategory")
    params.delete("price")
    params.delete("brand")
    params.delete("filter")
    params.delete("variantFilter")
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleCategoryChange = (value: string) => {
    pushParams((params) => {
      if (value === "all") {
        params.delete("category")
      } else {
        params.set("category", value)
      }
      params.delete("subCategory")
      params.delete("brand")
      params.delete("filter")
      params.delete("variantFilter")
    })
  }

  const handleSubCategoryChange = (value: string) => {
    pushParams((params) => {
      if (value === "all") {
        params.delete("subCategory")
      } else {
        params.set("subCategory", value)
      }
    })
  }

  const handlePriceChange = (value: string) => {
    pushParams((params) => {
      if (!value) {
        params.delete("price")
      } else {
        const [min, max] = value.split("-").map(Number)
        params.set("price", btoa(JSON.stringify([min, max])))
      }
    })
  }

  const handleBrandChange = (brandId: number) => {
    const updated = selectedBrands.includes(brandId)
      ? selectedBrands.filter((id) => id !== brandId)
      : [...selectedBrands, brandId]
    pushParams((params) => {
      if (updated.length) {
        params.set("brand", btoa(JSON.stringify(updated)))
      } else {
        params.delete("brand")
      }
    })
  }

  // Toggle a single option value inside the filter or variantFilter param
  const handleVariantOptionChange = (
    optionName: string,
    optionValueId: number,
    appliedOnVariant: boolean
  ) => {
    const paramKey = appliedOnVariant ? "variantFilter" : "filter"
    const currentMap = appliedOnVariant ? currentVariantFilterMap : currentFilterMap

    const currentIds = currentMap[optionName] ?? []
    const updated = currentIds.includes(optionValueId)
      ? currentIds.filter((id) => id !== optionValueId)
      : [...currentIds, optionValueId]

    const newMap = { ...currentMap, [optionName]: updated }
    if (updated.length === 0) delete newMap[optionName]

    pushParams((params) => {
      if (Object.keys(newMap).length === 0) {
        params.delete(paramKey)
      } else {
        params.set(paramKey, encodeFilterMap(newMap))
      }
    })
  }

  const isOptionSelected = (
    optionName: string,
    optionValueId: number,
    appliedOnVariant: boolean
  ) => {
    const map = appliedOnVariant ? currentVariantFilterMap : currentFilterMap
    return (map[optionName] ?? []).includes(optionValueId)
  }

  // Split categoryOptions into variant-applied and non-variant groups
  const variantOptionGroups = categoryOptions.filter((opt) => opt.appliedOnVariant)
  const filterOptionGroups = categoryOptions.filter((opt) => !opt.appliedOnVariant)
  const brands = categoryOptions?.[0]?.brands ?? []

  // Sub-categories for the selected category
  const activeCategoryObj = categories.find((c) => String(c.id) === String(selectedCategory))
  const subCategories: SubCategory[] = activeCategoryObj?.sub_category ?? []

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "grey.200",
        bgcolor: "background.paper"
      }}
    >
      {/* CLEAR ALL */}
      {hasActiveFilters && (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: "text.primary" }}>
            Filters
          </Typography>
          <Button
            size="small"
            variant="text"
            onClick={handleClearAll}
            sx={{
              fontSize: 11,
              fontWeight: 600,
              color: "primary.main",
              textTransform: "none",
              p: 0,
              minWidth: 0,
              "&:hover": { bgcolor: "transparent", textDecoration: "underline" }
            }}
          >
            Clear all
          </Button>
        </Box>
      )}

      {/* CATEGORY — with inline sub-categories */}
      <Typography sx={SECTION_HEADING}>Category</Typography>
      <RadioGroup value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)}>
        <FormControlLabel
          value="all"
          control={<Radio size="small" />}
          label="All Categories"
          sx={{ "& .MuiFormControlLabel-label": { fontSize: 14 } }}
        />
        {categories.map((cat, index) => {
          const dot =
            CATEGORY_DOT[cat.name?.trim().toLowerCase()] ??
            FALLBACK_DOTS[index % FALLBACK_DOTS.length]
          const isSelected = String(selectedCategory) === String(cat.id)

          return (
            <Box key={cat.id}>
              <FormControlLabel
                value={cat.id}
                control={
                  <Radio
                    size="small"
                    onClick={() => {
                      if (isSelected) handleCategoryChange("all")
                    }}
                  />
                }
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    {!isSelected && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: dot,
                          flexShrink: 0
                        }}
                      />
                    )}
                    <span style={{ fontSize: 14, textTransform: "lowercase" }}>{cat.name}</span>
                  </Box>
                }
              />

              {/* Sub-categories indented under the selected parent */}
              {isSelected && subCategories.length > 0 && (
                <Box pl={3.5} mb={0.5}>
                  <RadioGroup
                    value={selectedSubCategory}
                    onChange={(e) => handleSubCategoryChange(e.target.value)}
                  >
                    {subCategories.map((sub) => {
                      const isSubSelected = String(selectedSubCategory) === String(sub.id)
                      return (
                        <FormControlLabel
                          key={sub.id}
                          value={sub.id}
                          control={
                            <Radio
                              size="small"
                              sx={{ "& .MuiSvgIcon-root": { fontSize: 16 } }}
                              onClick={() => {
                                if (isSubSelected) handleSubCategoryChange("all")
                              }}
                            />
                          }
                          label={
                            <span style={{ fontSize: 13, textTransform: "lowercase" }}>
                              {sub.name}
                            </span>
                          }
                          sx={{ mb: 0 }}
                        />
                      )
                    })}
                  </RadioGroup>
                </Box>
              )}
            </Box>
          )
        })}
      </RadioGroup>

      {/* VARIANT OPTION FILTERS (e.g. Size, Weight, Color — appliedOnVariant = true) */}
      {variantOptionGroups.map((group) => (
        <Box key={group.variantOptionId} mt={3}>
          <Typography sx={SECTION_HEADING}>{group.optionName}</Typography>
          <FormGroup>
            {group.optionValues.map((opt) => (
              <FormControlLabel
                key={opt.optionValueId}
                control={
                  <Checkbox
                    size="small"
                    checked={isOptionSelected(group.optionName, opt.optionValueId, true)}
                    onChange={() =>
                      handleVariantOptionChange(group.optionName, opt.optionValueId, true)
                    }
                  />
                }
                label={<span style={{ fontSize: 12 }}>{opt.optionValueName}</span>}
              />
            ))}
          </FormGroup>
        </Box>
      ))}

      {/* NON-VARIANT OPTION FILTERS (appliedOnVariant = false) */}
      {filterOptionGroups.map((group) => (
        <Box key={group.variantOptionId} mt={3}>
          <Typography sx={SECTION_HEADING}>{group.optionName}</Typography>
          <FormGroup>
            {group.optionValues.map((opt) => (
              <FormControlLabel
                key={opt.optionValueId}
                control={
                  <Checkbox
                    size="small"
                    checked={isOptionSelected(group.optionName, opt.optionValueId, false)}
                    onChange={() =>
                      handleVariantOptionChange(group.optionName, opt.optionValueId, false)
                    }
                  />
                }
                label={<span style={{ fontSize: 12 }}>{opt.optionValueName}</span>}
              />
            ))}
          </FormGroup>
        </Box>
      ))}

      {/* PRICE */}
      <Typography sx={{ ...SECTION_HEADING, mt: 3 }}>Price</Typography>
      <RadioGroup value={decodedPrice} onChange={(e) => handlePriceChange(e.target.value)}>
        {PRICE_RANGES.map((range) => {
          const value = `${range.min}-${range.max}`
          const isSelected = decodedPrice === value
          return (
            <FormControlLabel
              key={range.label}
              value={value}
              control={
                <Radio
                  size="small"
                  onClick={() => {
                    if (isSelected) handlePriceChange("")
                  }}
                />
              }
              label={range.label}
              sx={{ "& .MuiFormControlLabel-label": { fontSize: 12 } }}
            />
          )
        })}
      </RadioGroup>

      {/* BRAND */}
      {brands.length > 0 && (
        <Box mt={3}>
          <Typography sx={SECTION_HEADING}>Brand</Typography>
          <FormGroup>
            {brands.map((brand) => (
              <FormControlLabel
                key={brand.brandId}
                control={
                  <Checkbox
                    size="small"
                    checked={selectedBrands.includes(brand.brandId)}
                    onChange={() => handleBrandChange(brand.brandId)}
                  />
                }
                label={brand.brandName}
                sx={{ "& .MuiFormControlLabel-label": { fontSize: 12 } }}
              />
            ))}
          </FormGroup>
        </Box>
      )}
    </Box>
  )
}
