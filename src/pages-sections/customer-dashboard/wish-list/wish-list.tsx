import { Fragment } from "react"
import Favorite from "@mui/icons-material/Favorite"
import DashboardHeader from "../dashboard-header"
import { CustomerWishItemElement, WishListCategory } from "@/models/WishList.modal"
import { Box, Divider, Typography } from "@mui/material"
import LazyImage from "@/components/LazyImage"
import { Delete, Edit } from "@mui/icons-material"

interface Props {
  categories: WishListCategory[]
  activeCategory: WishListCategory | null
  onCategoryClick: (cat: WishListCategory) => void
  items: Record<string, CustomerWishItemElement[]>
}

export default function WishListPageView({
  categories,
  onCategoryClick,
  items
}: Props) {
  return (
    <Fragment>
      <DashboardHeader title="My Wish List" Icon={Favorite} />

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        {categories.map((c) => (
          <button
            key={c.wishListCategoryId}
            onClick={() => onCategoryClick(c)}
            style={{
              padding: "6px 0",
              borderRadius: "6px",
              border: "1px solid #ccc",
              background: "white",
              cursor: "pointer"
            }}
          >
            <Box sx={{
              px: '48px',
              pt: 2
            }}>
              {
                items[c.wishListCategoryId]?.length ? <Box sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                  justifyItems: 'center',
                }}>
                  <LazyImage alt={items[c.wishListCategoryId][0].variantName} src={items[c.wishListCategoryId][0].images[0].fullImagepath} sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '100%'
                  }} width={30} height={30} />
                  {
                    items[c.wishListCategoryId]?.length > 1 &&
                    <Typography variant="subtitle2">
                      +{items[c.wishListCategoryId]?.length - 1} Items
                    </Typography>
                  }
                </Box> : <Box sx={{ height: '50px', display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6">
                    No items added yet
                  </Typography>
                </Box>
              }
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ my: 1, display: 'flex', justifyContent: 'space-between', px: 2 }}>
              <Typography variant="h6">
                {c.wishListCategoryName}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Edit fontSize='small' />
                <Delete fontSize='small' color="error" />
              </Box>
            </Box>
          </button>
        ))}
      </div>



      {/* 
      <Grid container spacing={3}>
        {items?.map((product) => (
          <Grid size={{ lg: 4, sm: 6, xs: 12 }} key={`${product.customerWishItemId}-${product.itemId}-${product.variantid}`}>
            <ProductCard17 bgWhite product={{
              categories: [product.category],
              discount: product.savePricePctg,
              id: product.id.toString(),
              images: product.images.map(i => i.fullImagepath),
              price: product.price_regular,
              slug: product.id.toString(),
              thumbnail: product.images[0].fullImagepath,
              title: product.variantName,
              offer: product.offer.offerDescription,
              rating: product.itemRating,
              itemVariantId: product.variantid
            }} />
          </Grid>
        ))}
      </Grid> */}
    </Fragment>
  )
}
