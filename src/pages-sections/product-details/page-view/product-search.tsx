"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
// MUI
import Grid from "@mui/material/Grid"
import MenuItem from "@mui/material/MenuItem"
import TextField from "@mui/material/TextField"
import Container from "@mui/material/Container"
import Pagination from "@mui/material/Pagination"
import Typography from "@mui/material/Typography"
// MUI ICON COMPONENTS
// GLOBAL CUSTOM COMPONENTS
import { FlexBetween, FlexBox } from "components/flex-box"
import ProductsGridView from "components/products-view/products-grid-view"
// TYPES
import Filters from "models/Filters"
import { DataList } from "@/models/AllProduct.model"
import ProductFilters from "@/components/products-view/filters"
import { GetCategoryResponse } from "@/models/Category.modal"

const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Date", value: "date" },
  { label: "Price Low to High", value: "asc" },
  { label: "Price High to Low", value: "desc" }
]

// ==============================================================
interface Props {
  filters: Filters;
  products: DataList[];
  pageCount: number;
  lastIndex: number;
  firstIndex: number;
  totalProducts: number;
  categoryOptions: GetCategoryResponse[] 
}
// ==============================================================

export default function ProductSearchPageView({
    // filters, 
  products,
  pageCount,
  lastIndex,
  firstIndex,
  totalProducts,
   categoryOptions
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const query = searchParams.get("q")
  const page = searchParams.get("page") || "1"
  const sort = searchParams.get("sort") || "relevance"

  const handleChangeSearchParams = (key: string, value: string) => {
    if (!key || !value) return
    const params = new URLSearchParams(searchParams)
    params.set(key, value)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="bg-white pt-2 pb-4">
      <Container>
        {/* FILTER ACTION AREA */}
        <FlexBetween flexWrap="wrap" gap={2} mb={2}>
          {query ? (
            <div>
              <Typography variant="h5" sx={{ mb: 0.5 }}>
                Searching for “{query}”
              </Typography>
              <Typography variant="body1" sx={{ color: "grey.600" }}>
                {products.length} results found
              </Typography>
            </div>
          ) : (
            <div />
          )}

          <FlexBox alignItems="center" columnGap={4} flexWrap="wrap">
            <FlexBox alignItems="center" gap={1} flex="1 1 0">
              <Typography variant="body1" sx={{ color: "grey.600", whiteSpace: "pre" }}>
                Sort by:
              </Typography>

              <TextField
                select
                fullWidth
                size="small"
                value={sort}
                variant="outlined"
                placeholder="Sort by"
                onChange={(e) => handleChangeSearchParams("sort", e.target.value)}
                sx={{ flex: "1 1 0", minWidth: "150px" }}
              >
                {SORT_OPTIONS.map((item) => (
                  <MenuItem value={item.value} key={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
            </FlexBox>

            {/* <FlexBox alignItems="center" my="0.25rem">
              <Typography variant="body1" sx={{ color: "grey.600", mr: 1 }}>
                View:
              </Typography>

              <IconButton onClick={() => handleChangeSearchParams("view", "grid")}>
                <Apps fontSize="small" color={view === "grid" ? "primary" : "inherit"} />
              </IconButton>

              <IconButton onClick={() => handleChangeSearchParams("view", "list")}>
                <ViewList fontSize="small" color={view === "list" ? "primary" : "inherit"} />
              </IconButton>

              
              <Box display={{ md: "none", xs: "block" }}>
                <Sidenav
                  handler={(close) => (
                    <IconButton onClick={close}>
                      <FilterList fontSize="small" />
                    </IconButton>
                  )}
                >
                  <Box px={3} py={2}>
                    <ProductFilters filters={filters} />
                  </Box>
                </Sidenav>
              </Box>
            </FlexBox> */}
          </FlexBox>
        </FlexBetween>

        <Grid container spacing={4}>
          {/* PRODUCT FILTER SIDEBAR AREA */}
          <Grid size={{  md:3, xl:2}} sx={{ display: { md: "block", xs: "none" } }}>
            <ProductFilters   categoryOptions={categoryOptions} />
          </Grid>

          {/* PRODUCT VIEW AREA */}
          <Grid size={{ xs:12, md:9, xl:10 }}>
            {/* {view === "grid" ? (
              <ProductsGridView products={products} />
            ) : (
              <ProductsListView products={products} />
            )} */}

            <ProductsGridView products={products} />

            {
              !!pageCount &&
              <FlexBetween flexWrap="wrap" mt={6}>
                <Typography variant="body1" sx={{ color: "grey.600" }}>
                  Showing {firstIndex}-{lastIndex} of {totalProducts} Products
                </Typography>

                <Pagination
                  color="primary"
                  variant="outlined"
                  page={+page}
                  count={pageCount}
                  onChange={(_, page) => handleChangeSearchParams("page", page.toString())}
                />
              </FlexBetween>
            }

          </Grid>
        </Grid>
      </Container>
    </div>
  )
}
