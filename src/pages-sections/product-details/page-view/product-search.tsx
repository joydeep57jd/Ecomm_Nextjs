"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
// MUI
import Grid from "@mui/material/Grid"
import Chip from "@mui/material/Chip"
import MenuItem from "@mui/material/MenuItem"
import TextField from "@mui/material/TextField"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
// GLOBAL CUSTOM COMPONENTS
import { FlexBetween, FlexBox } from "components/flex-box"
import ProductsGridView from "components/products-view/products-grid-view"
// TYPES + API
import { DataList } from "@/models/AllProduct.model"
import ProductFilters from "@/components/products-view/filters"
import { GetCategoryResponse } from "@/models/Category.modal"
import { VariantOptionDetails } from "@/models/Filters.models"
import { useCategories } from "@/contexts/CategoriesContext"
import { decodeId } from "@/utils/url-id"
import SideNav from "@/components/side-nav"
import { Box, Button, IconButton } from "@mui/material"
import { Tune } from "@mui/icons-material"
import SearchOffIcon from "@mui/icons-material/SearchOff"

const SORT_OPTIONS = [
  { label: "New Arrival", value: "new arrival" },
  { label: "Price: Low to High", value: "price-low-to-high" },
  { label: "Price: High to Low", value: "price-high-to-low" }
]

// ==============================================================

interface Props {
  products: DataList[]
  categoryOptions: GetCategoryResponse[]
  variantOptions: VariantOptionDetails[]
  badges: string[]
  priceFilters: Record<string, number>
  totalRecords?: number
}
// ==============================================================

export default function ProductSearchPageView({
  products,
  categoryOptions,
  variantOptions,
  badges,
  priceFilters,
  totalRecords
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const sort = searchParams.get("sort") || "new arrival"

  // Reuse the categories already fetched by the layout (ShopLayout1) instead of
  // making a second request to ITEMS.GET_CATEGORY.
  const categories = useCategories()

  const rawCategoryId = searchParams.get("category")
  const rawSubCategoryId = searchParams.get("subCategory")
  const selectedCategoryId = rawCategoryId ? decodeId(rawCategoryId) : "all"
  const selectedSubCategoryId = rawSubCategoryId ? decodeId(rawSubCategoryId) : "all"

  const activeCategoryObj = categories.find((c) => String(c.id) === String(selectedCategoryId))
  const activeSubCategoryObj = activeCategoryObj?.sub_category?.find(
    (s) => String(s.id) === String(selectedSubCategoryId)
  )

  const categoryName = activeCategoryObj?.name ?? ""
  const subCategoryName = activeSubCategoryObj?.name ?? ""

  const pageTitle = subCategoryName || categoryName || "All Products"

  const handleChangeSearchParams = (key: string, value: string) => {
    if (!key || !value) return
    const params = new URLSearchParams(searchParams)
    params.set(key, value)
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleClearCategory = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("category")
    params.delete("subCategory")
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleClearSubCategory = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("subCategory")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="pt-2 pb-4">
      <Container>
        {/* HEADER: TITLE + COUNT + SORT */}
        <FlexBetween flexWrap="wrap" gap={2} mb={categoryName ? 1.5 : 3}>
          <FlexBox alignItems="center" gap={1.5}>
            {/* Mobile filter trigger */}
            <Box sx={{ display: { md: "none", xs: "block" } }}>
              <SideNav
                position="left"
                showCloseButton={true}
                handler={(close) => (
                  <IconButton onClick={close} sx={{ border: "1px solid", borderColor: "grey.300" }}>
                    <Tune fontSize="small" />
                  </IconButton>
                )}
              >
                <ProductFilters categories={categories} categoryOptions={categoryOptions} priceFilters={priceFilters} />
              </SideNav>
            </Box>

            <Box>
              <Typography
                variant="h3"
                fontWeight={800}
                fontSize={{ sm: 28, xs: 22 }}
                lineHeight={1.2}
                sx={{ textTransform: "capitalize" }}
              >
                {pageTitle}
              </Typography>
              {typeof totalRecords === "number" && (
                <Typography variant="body2" sx={{ color: "grey.500" }}>
                  {totalRecords} products
                </Typography>
              )}
            </Box>
          </FlexBox>

          <TextField
            select
            size="small"
            value={sort}
            variant="outlined"
            label="Sort"
            onChange={(e) => handleChangeSearchParams("sort", e.target.value)}
            sx={{ minWidth: 180, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          >
            {SORT_OPTIONS.map((item) => (
              <MenuItem value={item.value} key={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
        </FlexBetween>

        {/* ACTIVE FILTER CHIPS */}
        {categoryName && (
          <Box display="flex" alignItems="center" gap={1} mb={3} flexWrap="wrap">
            <Chip
              label={categoryName}
              onDelete={handleClearCategory}
              size="small"
              sx={{
                textTransform: "capitalize",
                fontSize: 12,
                fontWeight: 500,
                borderRadius: 2,
                bgcolor: "transparent",
                  border: "1px solid",
                  borderColor: "grey.300",
                  color: "text.primary",
                  "& .MuiChip-deleteIcon": { fontSize: 14, color: "text.secondary" }
              }}
            />
            {subCategoryName && (
              <Chip
                label={subCategoryName}
                onDelete={handleClearSubCategory}
                size="small"
                sx={{
                  textTransform: "capitalize",
                  fontSize: 12,
                  fontWeight: 500,
                  borderRadius: 2,
                  bgcolor: "transparent",
                  border: "1px solid",
                  borderColor: "grey.300",
                  color: "text.primary",
                  "& .MuiChip-deleteIcon": { fontSize: 14, color: "text.secondary" }
                }}
              />
            )}
            <Button
              size="small"
              variant="text"
              onClick={handleClearCategory}
              sx={{
                fontSize: 12,
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

        <Grid container spacing={4}>
          {/* PRODUCT FILTER SIDEBAR AREA */}
          <Grid size={{ md: 2.5, xl: 2.5 }} sx={{ display: { md: "block", xs: "none" } }}>
            <ProductFilters categories={categories} categoryOptions={categoryOptions} priceFilters={priceFilters} />
          </Grid>

          {/* PRODUCT VIEW AREA */}
          <Grid
            size={{
              xs: 12,
              md: 9.5,
              xl: 9.5
            }}
          >
            {/* {view === "grid" ? (
              <ProductsGridView products={products} />
            ) : (
              <ProductsListView products={products} />
            )} */}

            {products?.length ? (
              <ProductsGridView
                products={products}
                variantOptions={variantOptions}
                badges={badges}
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  py: { xs: 8, md: 12 },
                  px: 2
                }}
              >
                <Box
                  sx={{
                    width: 96,
                    height: 96,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "grey.100",
                    mb: 3
                  }}
                >
                  <SearchOffIcon sx={{ fontSize: 52, color: "grey.500" }} />
                </Box>

                <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
                  No products found
                </Typography>

                <Typography variant="body1" sx={{ color: "grey.600", maxWidth: 420 }}>
                  Sorry, we couldn&apos;t find any products in this selection right now. Please try
                  a different category or adjust your filters — new items are added regularly, so do
                  check back soon.
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}
