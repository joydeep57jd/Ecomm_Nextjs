"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
// MUI
import Add from "@mui/icons-material/Add"
import Button from "@mui/material/Button"
// GLOBAL CUSTOM HOOKS
import useCart from "hooks/useCart"
import { Cart } from "@/models/CartProductItem.models"
import { useUser } from "@/contexts/UserContenxt"
// CUSTOM DATA MODEL

// ==============================================================
type Props = { cart: Cart };
// ==============================================================

export default function AddToCartButton({ cart }: Props) {

  const { dispatch } = useCart()
  const { user } = useUser()

  const router = useRouter()
  const [isLoading, setLoading] = useState(false)

  const handleAddToCart = () => {
    setLoading(true)

    setTimeout(() => {
      dispatch({
        type: "CHANGE_CART_AMOUNT",
        payload: { ...cart, qty: 1 },
        isLoggedIn: !!user,
        user: user ?? undefined
      })

      router.push("/mini-cart", { scroll: false })
      setLoading(false)
    }, 500)
  }

  return (
    <Button
      color="primary"
      loading={isLoading}
      variant="contained"
      sx={{ padding: 0.5, minHeight: 0 }}
      onClick={handleAddToCart}
    >
      <Add fontSize="small" />
    </Button>
  )
}
