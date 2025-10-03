"use client"

import { Dispatch, Fragment, SetStateAction,  useState } from "react"
import Favorite from "@mui/icons-material/Favorite"
import DashboardHeader from "../dashboard-header"
import { CustomerWishItemElement, WishListCategory } from "@/models/WishList.modal"
import { Box, CircularProgress, Divider, Grid, Typography } from "@mui/material"
import LazyImage from "@/components/LazyImage"
import { Delete, Edit } from "@mui/icons-material"
import ProductCard17 from "@/components/product-cards/product-card-17"
import WishListModal from "./wish-list_modal"
import DeleteWishListCategoryModal from "./delete-wishlist-category"

interface Props {
  categories: WishListCategory[]
  activeCategory: WishListCategory | null
  onCategoryClick: (cat: WishListCategory) => void
  onDeleteCategory: (cat: WishListCategory) => void
  deletingCategoryId: number | null
  items: Record<string, CustomerWishItemElement[]>
  setCategories:Dispatch<SetStateAction<WishListCategory[] | null>>
}

export default function WishListPageView({
  categories,
  onDeleteCategory,
  deletingCategoryId,
  items,
  setCategories
}: Props) {
  
  const [selectedCategoryId, setSelectedCategoryId] = useState("")
  const [editingCategory, setEditingCategory] = useState<WishListCategory | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null)

  const handleOpenDeleteModal = (categoryId: number) => {
    setDeleteCategoryId(categoryId)
  }



  const handleCloseDeleteModal = (isReloadRequired: boolean) => {
    if (isReloadRequired && deleteCategoryId !== null) {
      setCategories(prev => (prev!).filter((cat) => cat.wishListCategoryId !== deleteCategoryId))
      onDeleteCategory(categories.find((c) => c.wishListCategoryId === deleteCategoryId)!)
    }
    setDeleteCategoryId(null)
  }

  return (
    <Fragment>
      <DashboardHeader title="My Wish List" Icon={Favorite} />

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        {!categories?.length && (
          <Typography variant="subtitle2">No collection Created Yet</Typography>
        )}

        {categories?.map((c) => (
          <button
            key={c.wishListCategoryId}
            onClick={() => setSelectedCategoryId(c.wishListCategoryId.toString())}
            style={{
              padding: "6px 0",
              borderRadius: "6px",
              border: "1px solid #ccc",
              background: "white",
              cursor: "pointer"
            }}
          >
            <Box sx={{ px: "48px", pt: 2 }}>
              {items[c.wishListCategoryId]?.length ? (
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    justifyItems: "center"
                  }}
                >
                  <LazyImage
                    alt={items[c.wishListCategoryId][0].variantName}
                    src={items[c.wishListCategoryId][0].images[0].fullImagepath}
                    sx={{ width: 50, height: 50, borderRadius: "100%" }}
                    width={30}
                    height={30}
                  />
                  {items[c.wishListCategoryId]?.length > 1 && (
                    <Typography variant="subtitle2">
                      +{items[c.wishListCategoryId]?.length - 1} Items
                    </Typography>
                  )}
                </Box>
              ) : (
                <Box sx={{ height: "50px", display: "flex", alignItems: "center" }}>
                  <Typography variant="h6">No items added yet</Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ my: 1, display: "flex", justifyContent: "space-between", px: 2 }}>
              <Typography variant="h6">{c.wishListCategoryName}</Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                {/* Edit Icon */}
                <Edit
                  fontSize="small"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingCategory(c)
                    setIsModalOpen(true)
                  }}
                />

                {deletingCategoryId === c.wishListCategoryId ? (
                  <CircularProgress size={16} />
                ) : (
                  <Delete
                    fontSize="small"
                    color="error"
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleOpenDeleteModal(c.wishListCategoryId)
                    }}
                  />
                )}
              </Box>
            </Box>
          </button>
        ))}
      </div>

      <Grid container spacing={3}>
        {items[selectedCategoryId]?.map((product, index) => (
          <Grid
            size={{ lg: 4, sm: 6, xs: 12 }}
            key={`${product.customerWishItemId}-${product.itemId}-${product.variantid}-${index}`}
          >
            <ProductCard17
              bgWhite
              product={{
                categories: [product.category],
                discount: product.savePricePctg,
                id: product.id.toString(),
                images: product.images.map((i) => i.fullImagepath),
                price: product.price_regular,
                slug: product.id.toString(),
                thumbnail: product.images[0].fullImagepath,
                title: product.variantName,
                offer: product.offer.offerDescription,
                rating: product.itemRating,
                itemVariantId: product.variantid
              }}
            />
          </Grid>
        ))}
      </Grid>

      <WishListModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={editingCategory}
        onUpdated={(updated) => {
          console.warn(updated)
          setCategories(updated)
          setIsModalOpen(false)
        }}
      />

      {deleteCategoryId && (
        <DeleteWishListCategoryModal
          handleCloseModal={handleCloseDeleteModal}
          categoryId={deleteCategoryId}
        />
      )}
    </Fragment>
  )
}
