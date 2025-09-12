"use client"

import Link from "next/link"
import { useCallback, useState } from "react"
import Button from "@mui/material/Button"
// GLOBAL CUSTOM HOOK
import useCart from "hooks/useCart"
// STYLED COMPONENTS
import { HoverWrapper } from "./styles"
// CUSTOM DATA MODEL

import { getCartProducts, setCart } from "@/utils/services/cart.service"
import { Cart } from "@/models/CartProductItem.models"
import Product from "@/models/Product.model"
import { useUser } from "@/contexts/UserContenxt"

// ========================================================
interface Props {
  product: Product;
}
// ========================================================

export default function HoverActions({ product }: Props) {

  const { user } = useUser()
  const { dispatch } = useCart()
  const [isCartLoading, setCartLoading] = useState(false)
  const [isQuickViewLoading, setQuickViewLoading] = useState(false)

  const handleAddToCart = useCallback(async () => {
    setCartLoading(true)
    try {
      const newProduct = { productId: +product.id, productName: product.title, qty: 1, productPrice: product.price, productImage: product.images[0], itemVariantId: product.variantId ?? 0 }
      const existing = getCartProducts()
      const updated: Cart[] = [
        ...existing, newProduct
      ]
      setCart(updated)


      dispatch({
        type: "CHANGE_CART_AMOUNT",
        payload: newProduct,
        isLoggedIn: !!user,
        user: user ?? undefined
      })
    } catch (err) {
      console.error("Add to cart failed", err)
    } finally {
      setCartLoading(false)
    }
  }, [dispatch])

  const handleQuickView = useCallback(() => {
    setQuickViewLoading(true)
  }, [])

  const handleNavigate = useCallback(() => {
    setQuickViewLoading(false)
  }, [])

  return (
    <HoverWrapper className="hover-box">
      <Link scroll={false} href="/mini-cart">
        <Button
          fullWidth
          color="primary"
          variant="contained"
          loading={isCartLoading}
          onClick={handleAddToCart}
          aria-label="Add to cart"
        >
          Add to cart
        </Button>
      </Link>

      <Link scroll={false} href={`/products/${product.id}`} onNavigate={handleNavigate}>
        <Button
          fullWidth
          disableElevation
          color="inherit"
          variant="contained"
          className="view-btn"
          onClick={handleQuickView}
          loading={isQuickViewLoading}
          aria-label="Quick view"
        >
          View
        </Button>
      </Link>
    </HoverWrapper>
  )
}
