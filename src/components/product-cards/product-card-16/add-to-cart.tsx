"use client"

import { useState } from "react"
// MUI
import Add from "@mui/icons-material/Add"
import Button from "@mui/material/Button"
import { Cart } from "@/models/CartProductItem.models"
import useCart from "@/hooks/useCart"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/UserContenxt"
// GLOBAL CUSTOM HOOKS
// CUSTOM DATA MODEL

// ==============================================================
type Props = { cart: Cart };
// ==============================================================

export default function AddToCart({ cart }: Props) {

  const { user } = useUser()
  const { dispatch } = useCart()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = () => {
    setIsLoading(true)

    setTimeout(() => {
      dispatch({
        type: "CHANGE_CART_AMOUNT",
        payload: { ...cart, qty: 1 },
        isLoggedIn: !!user,
        user: user ?? undefined
      })

      router.push("/mini-cart", { scroll: false })
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
