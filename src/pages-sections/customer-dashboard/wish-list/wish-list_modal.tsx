"use client"

import { useUser } from "@/contexts/UserContenxt"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Typography,
  Button,
  TextField
} from "@mui/material"
import { useState, useEffect } from "react"
import { saveWishlistCollection } from "@/utils/api/wishList"
import { WishListCategory } from "@/models/WishList.modal"

interface WishListModalProps {
  open: boolean
  onClose: () => void
  category: WishListCategory | null
  onUpdated: (updated: WishListCategory[]) => void
}

export default function WishListModal({ open, onClose, category, onUpdated }: WishListModalProps) {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const {user} = useUser()

  useEffect(() => {
    if (category) setName(category.wishListCategoryName)
  }, [category])

const handleSave = async () => {
  if (!name.trim() || !category) return
  setLoading(true)
  try {
    const response = await saveWishlistCollection({
      date: new Date().toISOString(),
      isDefault: category.isDefault,
      wishListCategoryId: category.wishListCategoryId,
      wishListCategoryName: name,
      customerId: Number(user?.customerId)
    })


    

    onUpdated(response)
    onClose()
  } catch (err) {
    console.error("Failed to update wishlist category", err)
  } finally {
    setLoading(false)
  }
}

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle>
        <Typography variant="h5">Edit Collection</Typography>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Collection Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
