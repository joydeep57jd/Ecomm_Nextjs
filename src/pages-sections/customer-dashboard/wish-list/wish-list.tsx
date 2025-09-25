import { Fragment } from "react"
import Grid from "@mui/material/Grid"
import Favorite from "@mui/icons-material/Favorite"
import DashboardHeader from "../dashboard-header"
import ProductCard17 from "components/product-cards/product-card-17"
import { CustomerWishItemElement, WishListCategory } from "@/models/WishList.modal"

interface Props {
  categories: WishListCategory[]
  activeCategory: WishListCategory | null
  onCategoryClick: (cat: WishListCategory) => void
  items: CustomerWishItemElement[]
}

export default function WishListPageView({
  categories,
  activeCategory,
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
              padding: "6px 12px",
              borderRadius: "6px",
              border:
                activeCategory?.wishListCategoryId === c.wishListCategoryId
                  ? "2px solid #1976d2"
                  : "1px solid #ccc",
              background:
                activeCategory?.wishListCategoryId === c.wishListCategoryId ? "#e3f2fd" : "white",
              cursor: "pointer"
            }}
          >
            {c.wishListCategoryName}
          </button>
        ))}
      </div>

      <Grid container spacing={3}>
        {items?.map((product) => (
          <Grid key={`${product.customerWishItemId}-${product.itemId}-${product.variantid}`} item>
            <ProductCard17 bgWhite product={product} />
          </Grid>
        ))}
      </Grid>
    </Fragment>
  )
}
