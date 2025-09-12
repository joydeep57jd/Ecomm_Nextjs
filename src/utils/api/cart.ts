import { AddToCartRequest, RemoteCart } from "@/models/CartProductItem.models"
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
