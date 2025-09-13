"use client"


import Button from "@mui/material/Button"
// GLOBAL CUSTOM HOOK

// CUSTOM DATA MODEL

import { useUser } from "@/contexts/UserContenxt"
import { Cart } from "@/models/CartProductItem.models"
import useCart from "@/hooks/useCart"
import { useCartDrawer } from "@/contexts/CartDrawerContext"

// ================================================================
type Props = { cart: Cart, fullWidth?: boolean };
// ================================================================

export default function AddToCart({ cart, fullWidth }: Props) {
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
