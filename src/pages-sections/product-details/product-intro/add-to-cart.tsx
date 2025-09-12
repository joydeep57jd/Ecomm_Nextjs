"use client"

import { useState } from "react"

import Button from "@mui/material/Button"
// GLOBAL CUSTOM HOOK

// CUSTOM DATA MODEL

import { useUser } from "@/contexts/UserContenxt"
import { Cart } from "@/models/CartProductItem.models"
import useCart from "@/hooks/useCart"
import { useRouter } from "next/navigation"

// ================================================================
type Props = { cart: Cart };
// ================================================================

export default function AddToCart({ cart }: Props) {
  

   const { user } = useUser()
  const { dispatch } = useCart()
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
      variant="contained"
      loading={isLoading}
      onClick={handleAddToCart}
      sx={{ mb: 4.5, px: "1.75rem", height: 40 }}
    >
      Add to Cart
    </Button>
  )
}
