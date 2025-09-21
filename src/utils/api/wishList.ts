import {
  SaveCollectionRequest,
  SaveCollectionResponse,
  SaveWishlistItemRequest,
  WishListCategoryResponse
} from "@/models/WishList.modal"
import axiosInstance from "../axiosInstance"
import API_URL from "../constants"

export const GetWishListCategory = async (customerId: number) => {
  const { data } = await axiosInstance.post<{ data: WishListCategoryResponse }>(
    API_URL.WISHLIST.GET_CATEGORY,
    { customerId }
  )
  return data.data
}

export const saveWishlistCollection = async (payload: SaveCollectionRequest) => {
  const { data } = await axiosInstance.post<{ data: SaveCollectionResponse }>(
    API_URL.WISHLIST.SAVE_CATEGORY,
    payload
  )
  return data.data.wishListCategory
}

export const saveWishlistItem = async (payload: SaveWishlistItemRequest) => {
  await axiosInstance.post<{ data: SaveCollectionResponse }>(API_URL.WISHLIST.SAVE_ITEM, payload)
}
