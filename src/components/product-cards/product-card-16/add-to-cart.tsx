"use client"

import { useState } from "react"
// MUI
import Add from "@mui/icons-material/Add"
import Button from "@mui/material/Button"
// GLOBAL CUSTOM HOOKS
// CUSTOM DATA MODEL

// ==============================================================
// type Props = { product: DataList };
// ==============================================================

export default function AddToCart() {

  // const { dispatch } = useCart()
  // const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = () => {
    setIsLoading(true)

    setTimeout(() => {
      // dispatch({
      //   type: "CHANGE_CART_AMOUNT",
      //   payload: { id, slug, price, title, thumbnail, qty: 1 }
      // })

      // router.push("/mini-cart", { scroll: false })
      setIsLoading(false)
    }, 1000)
  }

  return (
    <Button
      color="primary"
      variant="outlined"
      loading={isLoading}
      onClick={handleAddToCart}
      sx={{ padding: "3px" }}
    >
      <Add fontSize="small" />
    </Button>
  )
}
