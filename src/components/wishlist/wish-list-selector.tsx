"use client"
import { useUser } from "@/contexts/UserContenxt"
import { WishListCategory } from "@/models/WishList.modal"
import { GetWishListCategory, saveWishlistItem } from "@/utils/api/wishList"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from "@mui/material"
import React, { useEffect, useState } from "react"
import SaveCollection from "./save-collection"
import { SingleProductResponse } from "@/models/SingleProduct.model"
import { enqueueSnackbar } from "notistack"

type Props = {
  handleCloseModal(isReloadRequired: boolean): void
  product: SingleProductResponse
}

function WishlistSelector({ handleCloseModal, product }: Props) {
  const [isSaving, setIsSaving] = useState(false)
  const [wishListCategory, setWishListCategory] = useState<WishListCategory[] | null>(null)
  const [collectionId, setCollectionId] = useState<number | null>(null)
  const [canShowRequiredError, setCanShowRequiredError] = useState(false)
  const [isAddingNewCollection, setIsAddingNewCollection] = useState(false)
  const { user } = useUser()

  useEffect(() => {
    if (user) {
      fetchWishListCollections()
    }
  }, [user])

  const fetchWishListCollections = async () => {
    const data = await GetWishListCategory(+user!.customerId)
    setWishListCategory(data.getWishListCategory ?? [])
  }

  const onChange = (value: number) => {
    setCollectionId(value)
    setCanShowRequiredError(false)
  }

  const save = async () => {
    if (!collectionId) {
      setCanShowRequiredError(true)
      return
    }
    try {
      setIsSaving(true)
      await saveWishlistItem({
        customerId: +user!.customerId,
        date: new Date().toISOString(),
        itemId: product?.variantDetails?.itemId,
        itemVariantId: product?.variantDetails?.itemVariantId,
        note: "",
        notifyOnArrival: true,
        wishListCategoryId: collectionId,
        wishListCategoryName:
          wishListCategory?.find((collection) => collection.wishListCategoryId == collectionId)
            ?.wishListCategoryName || ""
      })
      enqueueSnackbar("Item added to wishlist", { variant: "success" })
      handleCloseModal(true)
    } catch {
      enqueueSnackbar("Failed to add item to wishlist", { variant: "error" })
    } finally {
      setIsSaving(false)
    }
  }

  const closeSaveCollection = (collections: WishListCategory[]) => {
    setIsAddingNewCollection(false)
    if (collections) {
      setWishListCategory(collections)
    }
  }

  return isAddingNewCollection ? (
    <SaveCollection handleCloseModal={closeSaveCollection} />
  ) : (
    <Dialog fullWidth open onClose={() => handleCloseModal(false)}>
      <DialogTitle>
        <Typography variant="h4">Select Collection</Typography>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="demo-simple-select-label">Collections</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Collections"
            value={collectionId}
            error={canShowRequiredError}
            onChange={(e) => onChange(e.target.value as number)}
          >
            {wishListCategory?.map((collection) => (
              <MenuItem key={collection.wishListCategoryId} value={collection.wishListCategoryId}>
                {collection.wishListCategoryName}
              </MenuItem>
            ))}
            {!wishListCategory?.length && (
              <MenuItem value={""}>
                {wishListCategory ? "No collection added yet" : "Please wait..."}
              </MenuItem>
            )}
          </Select>
          {canShowRequiredError && (
            <Typography
              variant="inherit"
              sx={{
                fontSize: "12px",
                color: "#E94560",
                marginLeft: "14px",
                mt: "4px"
              }}
            >
              Please select a collection
            </Typography>
          )}
        </FormControl>
        <Button onClick={() => setIsAddingNewCollection(true)} color="primary" variant="outlined">
          + Add new collection
        </Button>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ paddingX: 3, paddingY: 2 }}>
        <Button onClick={() => handleCloseModal(false)} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={save} color="primary" variant="contained" loading={isSaving}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default WishlistSelector
