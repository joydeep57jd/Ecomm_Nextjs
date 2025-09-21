import { WishListCategory } from "@/models/WishList.modal"
import axiosInstance from "../axiosInstance"
import API_URL from "../constants"

export const GetWishListCategory = async (customerId: number) => {
  const { data } = await axiosInstance.post<{ data: WishListCategory }>(
    API_URL.WISHLIST.GET_CATEGORY,
    customerId
  )
  return data.data
}


