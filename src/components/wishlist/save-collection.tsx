"use client"
import { useUser } from "@/contexts/UserContenxt"
import { WishListCategory } from "@/models/WishList.modal"
import { saveWishlistCollection } from "@/utils/api/wishList"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography
} from "@mui/material"
import { useState } from "react"

type Props = {
  handleCloseModal(WishListCategory?: WishListCategory[]): void
  wishListCategory?: WishListCategory
}

function SaveCollection({ handleCloseModal, wishListCategory }: Props) {
  const [isSaving, setIsSaving] = useState(false)
  const [collectionName, setCollectionName] = useState("")
  const [canShowRequiredError, setCanShowRequiredError] = useState(false)
  const { user } = useUser()

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCollectionName(e.target.value)
    setCanShowRequiredError(false)
  }

  const save = async () => {
    if (!collectionName) {
      setCanShowRequiredError(true)
      return
    }
    try {
      setIsSaving(true)
      const wishListCategories = await saveWishlistCollection({
        wishListCategoryId: 0,
        customerId: +user!.customerId,
        isDefault: false,
        ...(wishListCategory ? wishListCategory : {}),
        date: new Date().toISOString(),
        wishListCategoryName: collectionName
      })
      handleCloseModal(wishListCategories)
    } catch {
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog fullWidth open onClose={() => handleCloseModal()}>
      <DialogTitle>
        <Typography variant="h4">Add New Collection</Typography>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <TextField
          error={canShowRequiredError}
          helperText={canShowRequiredError && "Please enter collection name"}
          fullWidth
          id="outlined-basic"
          value={collectionName}
          onChange={onNameChange}
          label="Collection Name"
          variant="outlined"
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <Divider />
      <DialogActions sx={{ paddingX: 3, paddingY: 2 }}>
        <Button onClick={() => handleCloseModal()} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={save} color="primary" variant="contained" loading={isSaving}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SaveCollection
