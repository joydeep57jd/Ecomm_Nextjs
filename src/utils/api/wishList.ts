import {
  CustomerWishItem,
  CustomerWishItemPayload,
  DeleteCustomerWishItem,
  DeleteWishListCategory,
  DeleteWishListCategoryWithItems,
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

export const getCustomerWishItem = async(payload:CustomerWishItemPayload)=>{
  const {data} = await axiosInstance.post<{data:CustomerWishItem}>(API_URL.WISHLIST.GET_ITEMS,payload)
  return data.data.customerWishItems
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



export const deleteCustomerWishItem = async(payload:DeleteCustomerWishItem)=>{
  const {data} = await axiosInstance.post(API_URL.WISHLIST.DELETE_ITEM,payload)
  return data.data 

}


export const deleteWishListCategory = async(payload:DeleteWishListCategory)=>{
  const {data} = await axiosInstance.post<{data:DeleteWishListCategoryWithItems}>(API_URL.WISHLIST.DELETE_CATEGORY,payload)
  return data.data
}



