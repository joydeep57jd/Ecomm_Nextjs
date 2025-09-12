import { AddToCartRequest, Cart } from "@/models/CartProductItem.models"
import { getItem, removeItem, setItem } from "./local-storage.service"
import { addToCart } from "../api/cart"
import { UserData } from "@/models/Auth.model"

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

export const syncGuestCart = async (items: Cart[], user?: UserData) => {
  if (!items.length || !user) return

  const payload: AddToCartRequest = {
    customerid: +user.customerId,
    userId: user.id,
    carttItemVariant: items.map((item) => ({
      itemId: item.productId,
      itemVariantId: item.itemVariantId,
      itemQty: item.qty,
      itemPrice: item.productPrice
    }))
  }

  await addToCart(payload)
}
