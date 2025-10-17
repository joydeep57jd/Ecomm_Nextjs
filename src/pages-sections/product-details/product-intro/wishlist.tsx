"use client"
import WishlistSelector from "@/components/wishlist/wish-list-selector"
import { useUser } from "@/contexts/UserContenxt"
import Heart from "@/icons/Heart"
import HeartLine from "@/icons/HeartLine"
import { SingleProductResponse } from "@/models/SingleProduct.model"
import { CustomerWishItemElement } from "@/models/WishList.modal"
import { deleteCustomerWishItem, getCustomerWishItem } from "@/utils/api/wishList"
import { Alert, Avatar, CircularProgress, Snackbar } from "@mui/material"
import React, { useEffect, useState } from "react"

type Props = {
  product: SingleProductResponse
}

function Wishlist({ product }: Props) {
  let isWishitemFetched = false
  const [customerWishItemElements, setCustomerWishItemElements] = useState<
    CustomerWishItemElement[]
  >([])
  const [isWishItemLoading, setIsWishItemLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [open, setOpen] = useState(false)
  const [showLoginAlert, setShowLoginAlert] = useState(false)
  const { user } = useUser()

  useEffect(() => {
    if (!user?.customerId || isWishitemFetched) return
    isWishitemFetched = true
    getWishListItems()
  }, [])

  useEffect(() => {
    if (product?.variantDetails?.itemVariantId) checkIsAddedToWishList(customerWishItemElements)
  }, [product])

  const getWishListItems = async () => {
    setIsWishItemLoading(true)
    const items = await getCustomerWishItem({ customerId: +user!.customerId })
    setCustomerWishItemElements(items)
    checkIsAddedToWishList(items)
    setIsWishItemLoading(false)
  }

  const checkIsAddedToWishList = (items: CustomerWishItemElement[]) => {
    const isAdded =
      items.findIndex((item) => item.variantid === product?.variantDetails?.itemVariantId) > -1
    setIsAdded(isAdded)
  }

  const toggleItem = async () => {

     if (!user?.customerId) {
      setShowLoginAlert(true)
      return
    }
    if (isWishItemLoading) return
    if (!isAdded) setOpen(true)
    else {
      await removeItem()
      setCustomerWishItemElements((prev) =>
        prev.filter((item) => item.variantid !== product?.variantDetails?.itemVariantId)
      )
    }
  }

  const removeItem = async () => {
    await deleteCustomerWishItem({
      customerId: +user!.customerId,
      CustomerWishItemId: customerWishItemElements.find(
        (item) => item.variantid === product?.variantDetails?.itemVariantId
      )!.customerWishItemId,
      Date: new Date().toISOString()
    })
    setIsAdded(false)
  }

  const handleCloseModal = (isToggled: boolean) => {
    setOpen(false)
    if (isToggled) {
      getWishListItems()
    }
  }
  const handleCloseAlert = () => {
    setShowLoginAlert(false)
  }


  return (
    <div style={{ position: "relative" }}>
      <Avatar
        sx={{
          position: "absolute",
          right: "0.5rem",
          top: "0.5rem",
          cursor: "pointer"
        }}
        onClick={toggleItem}
        variant="rounded"
        className="avatar"
      >
        {isWishItemLoading ? (
          <CircularProgress size={20} color="error" />
        ) : isAdded ? (
          <Heart color="error" />
        ) : (
          <HeartLine color="primary" />
        )}
      </Avatar>
      {open && <WishlistSelector product={product} handleCloseModal={handleCloseModal} />}
      <Snackbar 
        open={showLoginAlert} 
        autoHideDuration={4000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseAlert} severity="info" sx={{ width: '100%' }}>
          Please login first to add items to your wishlist
        </Alert>
      </Snackbar>
    </div>
  )
}

export default Wishlist
