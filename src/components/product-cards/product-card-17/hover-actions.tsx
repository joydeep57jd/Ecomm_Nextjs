"use client"

import Link from "next/link"
import { useCallback, useState } from "react"
import Button from "@mui/material/Button"
// GLOBAL CUSTOM HOOK
import useCart from "hooks/useCart"
// STYLED COMPONENTS
import { HoverWrapper } from "./styles"
// CUSTOM DATA MODEL

import { getCartProducts, setCart, syncGuestCart } from "@/utils/services/cart.service"
import { Cart } from "@/models/CartProductItem.models"
import { DataList } from "@/models/AllProduct.model"

// ========================================================
interface Props {
  product: DataList;
}
// ========================================================

export default function HoverActions({ product }: Props) {
  const { id, slug, title, price, thumbnail } = product

  const { dispatch } = useCart()
  const [isCartLoading, setCartLoading] = useState(false)
  const [isQuickViewLoading, setQuickViewLoading] = useState(false)

  const handleAddToCart = useCallback(async () => {
    setCartLoading(true)
    try {
      
      const existing = getCartProducts()
      const updated:Cart[] = [
        ...existing,
      {productId:product.id,productName:product.itemName,productQty:1,productPrice:product.savePrice,productImage:product.imageList[0].fullImagepath,itemVariantId:product.itemId}   
      ]
      setCart(updated)

      // 2. Sync with backend
      await syncGuestCart(updated)

     
      dispatch({
        type: "CHANGE_CART_AMOUNT",
        payload: {}
      })
    } catch (err) {
      console.error("Add to cart failed", err)
    } finally {
      setCartLoading(false)
    }
  }, [dispatch, id, slug, title, price, thumbnail])

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

      <Link scroll={false} href={`/products/${slug}/view`} onNavigate={handleNavigate}>
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
