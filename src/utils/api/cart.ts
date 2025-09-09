import { AddToCartRequest } from "@/models/CartProductItem.models"
import axios from "@/utils/axiosInstance"
import { API_URL } from "@/utils/constants"


export const addToCart = async (cart: AddToCartRequest) => {
  const response = await axios.post(API_URL.CART.SAVE, cart)
  return response.data
}



