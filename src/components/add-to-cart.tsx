"use client"

import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import { ShoppingCart } from "@mui/icons-material"
import { useUser } from "@/contexts/UserContenxt"
import { Cart } from "@/models/CartProductItem.models"
import useCart from "@/hooks/useCart"
import { useCartDrawer } from "@/contexts/CartDrawerContext"

type Props = {
  cart: Cart
  fullWidth?: boolean
  variantType?: "button" | "icon"
}

export default function AddToCart({ cart, fullWidth, variantType = "button" }: Props) {
  const { user } = useUser()
  const { dispatch } = useCart()
  const { setOpen } = useCartDrawer()

  const handleAddToCart = () => {
    dispatch({
      type: "CHANGE_CART_AMOUNT",
      payload: { ...cart, qty: 1 },
      isLoggedIn: !!user,
      user: user ?? undefined
    })
    setOpen(true)
  }

  if (variantType === "icon") {
    return (
      <IconButton
        onClick={handleAddToCart}
        disabled={!cart.stockQty}
        sx={{
          background: "#fff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          "&:hover": { background: "#f5f5f5" }
        }}
      >
        <ShoppingCart sx={{ fontSize: 18 }} />
      </IconButton>
    )
  }

  return (
    <Button
      fullWidth={fullWidth}
      color="primary"
      variant="contained"
      disabled={!cart.stockQty}
      onClick={handleAddToCart}
    >
      Add to Cart
    </Button>
  )
}
