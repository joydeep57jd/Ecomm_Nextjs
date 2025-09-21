export interface WishListCategory {
  getWishListCategory: GetWishListCategory[]
}

export interface GetWishListCategory {
  wishListCategoryId: number
  wishListCategoryName: string
  isDefault: boolean
}
