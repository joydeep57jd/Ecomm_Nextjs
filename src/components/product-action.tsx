"use client"
import useCart from "@/hooks/useCart"
import { Cart } from "@/models/CartProductItem.models"
import { useRouter } from "next/navigation"
import React, { ReactNode, useCallback } from "react"
import AddToCart from "./add-to-cart"
import { isProductAddedToCart } from "@/utils/api/product"
import { Button } from "@mui/material"
import type { SxProps, Theme } from "@mui/material/styles"

type Props = {
  product: Cart
  fullWidth?: boolean
  label?: string
  startIcon?: ReactNode
  sx?: SxProps<Theme>
}

const ProductAction = ({ product, fullWidth, label, startIcon, sx }: Props) => {
  const {
    state: { cart }
  } = useCart()
  const router = useRouter()

  const handleGoToCart = useCallback(() => {
    router.push("/cart")
  }, [])

  return isProductAddedToCart(cart, product.itemVariantId ?? 0, product.productId) ? (
    <Button
      color="primary"
      fullWidth={fullWidth}
      variant="contained"
      startIcon={startIcon}
      sx={sx}
      onClick={handleGoToCart}
      aria-label="Go to cart"
    >
      Go to cart
    </Button>
  ) : (
    <AddToCart fullWidth={fullWidth} cart={product} label={label} startIcon={startIcon} sx={sx} />
  )
}

export default ProductAction
