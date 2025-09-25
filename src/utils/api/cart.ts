import { AddToCartRequest, Cart, RemoteCart } from "@/models/CartProductItem.models"
import axios from "@/utils/axiosInstance"
import { API_URL } from "@/utils/constants"

export const addToCart = async (cart: AddToCartRequest) => {
  const response = await axios.post(API_URL.CART.SAVE, cart)
  return response.data
}

export const getCart = async (customerid: number) => {
  const response = await axios.post<{ data: RemoteCart[] }>(API_URL.CART.GET, { customerid })
  return response.data.data
}

export const getLocalCartFromRemoteCart = (remoteCarts: RemoteCart[]) => {
  const finalCarts: Cart[] = (Array.isArray(remoteCarts) ? remoteCarts : []).map((cart) => ({
    itemVariantId: cart?.variantid,
    productId: cart?.id,
    productImage: cart?.images[0].fullImagepath,
    productName: cart?.name,
    productPrice: cart?.price_regular,
    qty: cart?.quantity,
    stockQty: cart.stockQty,
    variantName: cart.variantName,
    mrp: cart.mrp,
    variantOptionDetails: cart.variantOptionDetails
  }))
  return finalCarts
}
