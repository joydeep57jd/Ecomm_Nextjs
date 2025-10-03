"use client"

import { deleteWishListCategory } from "@/utils/api/wishList"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from "@mui/material"
import React, { useState } from "react"

import { useUser } from "@/contexts/UserContenxt"

interface Props {
  handleCloseModal: (isReloadRequired: boolean) => void
  categoryId: number
}

const DeleteWishListCategoryModal = ({ handleCloseModal, categoryId }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const { user } = useUser()

  const deleteRecord = async () => {
    if (!user) return
    setIsDeleting(true)
    try {
      await deleteWishListCategory({
        wishListCategoryId: categoryId,
        customerId: +user.customerId
      })
      handleCloseModal(true) 
    } catch (err) {
      console.error("Error deleting wishlist category:", err)
      handleCloseModal(false)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open onClose={() => handleCloseModal(false)} fullWidth>
      <DialogTitle>
        <Typography variant="h4">Delete Wishlist Category</Typography>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Are you sure you want to delete this wishlist category?
        </Typography>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={() => handleCloseModal(false)} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={deleteRecord}
          color="error"
          variant="contained"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteWishListCategoryModal
