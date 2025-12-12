// "use client"
// import WishlistSelector from "@/components/wishlist/wish-list-selector"
// import { useUser } from "@/contexts/UserContenxt"
// import Heart from "@/icons/Heart"
// import HeartLine from "@/icons/HeartLine"
// import { SingleProductResponse } from "@/models/SingleProduct.model"
// import { CustomerWishItemElement } from "@/models/WishList.modal"
// import { deleteCustomerWishItem, getCustomerWishItem } from "@/utils/api/wishList"
// import { Alert, Avatar, CircularProgress, Snackbar } from "@mui/material"
// import { enqueueSnackbar } from "notistack"
// import React, { useEffect, useState } from "react"

// type Props = {
//   product: SingleProductResponse
// }

// function Wishlist({ product }: Props) {
//   let isWishitemFetched = false
//   const [customerWishItemElements, setCustomerWishItemElements] = useState<
//     CustomerWishItemElement[]
//   >([])
//   const [isWishItemLoading, setIsWishItemLoading] = useState(false)
//   const [isAdded, setIsAdded] = useState(false)
//   const [open, setOpen] = useState(false)
//   const [showLoginAlert, setShowLoginAlert] = useState(false)
//   const { user } = useUser()

//   useEffect(() => {
//     if (!user?.customerId || isWishitemFetched) return
//     isWishitemFetched = true
//     getWishListItems()
//   }, [])

//   useEffect(() => {
//     if (product?.variantDetails?.itemVariantId) checkIsAddedToWishList(customerWishItemElements)
//   }, [product])

//   const getWishListItems = async () => {
//     setIsWishItemLoading(true)
//     const items = await getCustomerWishItem({ customerId: +user!.customerId })
//     setCustomerWishItemElements(items)
//     checkIsAddedToWishList(items)
//     setIsWishItemLoading(false)

//   }

//   const checkIsAddedToWishList = (items: CustomerWishItemElement[]) => {
//     const isAdded =
//       items?.findIndex((item) => item.variantid === product?.variantDetails?.itemVariantId) > -1
//     setIsAdded(isAdded)
//   }

//   const toggleItem = async () => {
//     if (!user?.customerId) {
//       setShowLoginAlert(true)
//       return
//     }
//     if (isWishItemLoading) return
//     if (!isAdded) setOpen(true)
//     else {
//       await removeItem()
//       setCustomerWishItemElements((prev) =>
//         prev.filter((item) => item.variantid !== product?.variantDetails?.itemVariantId)
//       )
//     }
//   }

//   const removeItem = async () => {
//     await deleteCustomerWishItem({
//       customerId: +user!.customerId,
//       CustomerWishItemId: customerWishItemElements.find(
//         (item) => item.variantid === product?.variantDetails?.itemVariantId
//       )!.customerWishItemId,
//       Date: new Date().toISOString()
//     })
//     enqueueSnackbar("Item remove to wishlist", { variant: "success" })
//     setIsAdded(false)
//   }

//   const handleCloseModal = (isToggled: boolean) => {
//     setOpen(false)
//     if (isToggled) {
//       getWishListItems()
//     }
//   }

//   const handleCloseAlert = () => {
//     setShowLoginAlert(false)
//   }

//   return (
//     <div style={{ position: "relative" }}>
//       <Avatar
//         sx={{
//           position: "absolute",
//           right: "0.5rem",
//           top: "0.5rem",
//           cursor: "pointer"
//         }}
//         onClick={toggleItem}
//         variant="rounded"
//         className="avatar"
//       >
//         {isWishItemLoading ? (
//           <CircularProgress size={20} color="error" />
//         ) : isAdded ? (
//           <Heart color="error" />
//         ) : (
//           <HeartLine color="primary" />
//         )}
//       </Avatar>
//       {open && <WishlistSelector product={product} handleCloseModal={handleCloseModal} />}
//        <Snackbar
//         open={showLoginAlert}
//         autoHideDuration={2000}
//         onClose={handleCloseAlert}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//       >
//         <Alert onClose={handleCloseAlert} severity="info" sx={{ width: '100%' }}>
//           Please login first to add items to your wishlist
//         </Alert>
//       </Snackbar>
//     </div>
//   )
// }

// export default Wishlist

"use client"
// import WishlistSelector from "@/components/wishlist/wish-list-selector"
import { useUser } from "@/contexts/UserContenxt"
import Heart from "@/icons/Heart"
import HeartLine from "@/icons/HeartLine"
import { SingleProductResponse } from "@/models/SingleProduct.model"
import { CustomerWishItemElement } from "@/models/WishList.modal"
import {
  deleteCustomerWishItem,
  getCustomerWishItem,
  GetWishListCategory,
  saveWishlistItem
} from "@/utils/api/wishList"
import { Alert, Avatar, CircularProgress, Snackbar } from "@mui/material"
import { enqueueSnackbar } from "notistack"
import React, { useEffect, useState, useRef } from "react"

type Props = {
  product: SingleProductResponse
}

function Wishlist({ product }: Props) {
  const isWishitemFetched = useRef(false)

  const [customerWishItemElements, setCustomerWishItemElements] = useState<
    CustomerWishItemElement[]
  >([])
  const [isWishItemLoading, setIsWishItemLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  // const [open, setOpen] = useState(false)
  const [showLoginAlert, setShowLoginAlert] = useState(false)
  const { user } = useUser()

  // fetch wishlist once
  useEffect(() => {
    if (!user?.customerId || isWishitemFetched.current) return
    isWishitemFetched.current = true
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
      items?.findIndex((item) => item.variantid === product?.variantDetails?.itemVariantId) > -1
    setIsAdded(isAdded)
  }

  const toggleItem = async () => {
    if (!user?.customerId) {
      setShowLoginAlert(true)
      return
    }
    if (isWishItemLoading) return

    if (!isAdded) {
      setIsAdded(true) 
      await addToDefaultCollection()
    }
    // setOpen(true)
    else {
      setIsAdded(false)
      await removeItem()
      setCustomerWishItemElements((prev) =>
        prev.filter((item) => item.variantid !== product?.variantDetails?.itemVariantId)
      )
    }
  }

  const addToDefaultCollection = async () => {
    try {
      const collections = await GetWishListCategory(+user!.customerId)
      console.warn(collections)

      const defaultCollection = collections?.getWishListCategory?.[0] || {
        wishListCategoryId: 0,
        wishListCategoryName: "Liked Items"
      }

      await saveWishlistItem({
        customerId: +user!.customerId,
        date: new Date().toISOString(),
        itemId: product?.variantDetails?.itemId,
        itemVariantId: product?.variantDetails?.itemVariantId,
        note: "",
        notifyOnArrival: true,
        wishListCategoryId: defaultCollection.wishListCategoryId,
        wishListCategoryName: defaultCollection.wishListCategoryName
      })

      enqueueSnackbar("Added to wishlist ", { variant: "success" })

      getWishListItems()
    } catch {
      enqueueSnackbar("Failed to add item", { variant: "error" })
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
    enqueueSnackbar("Item removed from wishlist", { variant: "success" })
  }

  const handleCloseAlert = () => setShowLoginAlert(false)

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

      {/* Dialog disabled intentionally for default collection behavior */}
      {/* {open && <WishlistSelector product={product} handleCloseModal={handleCloseModal} />} */}

      <Snackbar
        open={showLoginAlert}
        autoHideDuration={2000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseAlert} severity="info" sx={{ width: "100%" }}>
          Please login first to add items to your wishlist
        </Alert>
      </Snackbar>
    </div>
  )
}

export default Wishlist
