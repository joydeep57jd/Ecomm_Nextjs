import { AddToCartRequest, CartProductItem } from "@/models/CartProductItem.models"
import { getItem, removeItem, setItem } from "./local-storage.service"
import { addToCart } from "../api/cart"

const CART_KEY = "guest_cart"

export const getCartProducts = (): CartProductItem[] => {
  const data = getItem(CART_KEY)
  return data ? JSON.parse(data) : []
}

export const setCart = (items: CartProductItem[]) => {
  setItem(CART_KEY, JSON.stringify(items))
}

export const clearCart = () => {
  removeItem(CART_KEY)
}

export const syncGuestCart = async (items: CartProductItem[]) => {
  const guestItems = getCartProducts()
  if (!guestItems.length) return

  const payload:AddToCartRequest = {
    customerid: 0,
    userId: "",
    carttItemVariant: items.map((item) => ({
      itemId: item.id,
      itemVariantId: item.variantid,
      itemQty: item.quantity,
      itemPrice: item.price_regular
    }))
  }

  await addToCart(payload)
}
