import { AddToCartRequest, Cart,  } from "@/models/CartProductItem.models"
import { getItem, removeItem, setItem } from "./local-storage.service"
import { addToCart } from "../api/cart"

const CART_KEY = "guest_cart"

export const getCartProducts = (): Cart[] => {
  const data = getItem(CART_KEY)
  return data ? JSON.parse(data) : []
}

export const setCart = (items: Cart[]) => {
  setItem(CART_KEY, JSON.stringify(items))
}

export const clearCart = () => {
  removeItem(CART_KEY)
}

export const syncGuestCart = async (items: Cart[]) => {
  const guestItems = getCartProducts()
  if (!guestItems.length) return

  const payload:AddToCartRequest = {
    customerid: 0,
    userId: "",
    carttItemVariant: items.map((item) => ({
      itemId: item.productId,
      itemVariantId: item.itemVariantId,
      itemQty: item.productQty,
      itemPrice: item.productPrice
    }))
  }

  await addToCart(payload)
}
