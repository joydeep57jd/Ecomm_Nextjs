export interface WishListCategoryResponse {
  getWishListCategory: WishListCategory[]
}

export interface WishListCategory {
  wishListCategoryId: number
  wishListCategoryName: string
  isDefault: boolean
}

export interface SaveCollectionResponse {
  wishListCategory: WishListCategory[]
}

export interface SaveCollectionRequest {
  date: string
  isDefault: boolean
  wishListCategoryId: number
  wishListCategoryName: string
  customerId: number
}

export interface SaveWishlistItemRequest {
  customerId: number
  itemId: number
  itemVariantId: number
  notifyOnArrival: boolean
  wishListCategoryId: number
  wishListCategoryName: string
  note: string
  date: string
}
