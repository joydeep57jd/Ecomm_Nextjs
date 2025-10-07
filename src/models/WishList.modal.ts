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

export interface DeleteCustomerWishItem {
  CustomerWishItemId: number
  customerId: number
  Date: string
}

export interface DeleteWishListCategory {
  wishListCategoryId: number
  customerId: number
}

export interface CustomerWishItemPayload {
  wishListCategoryId?: number
  customerId: number
  variantid?: number
}

export interface DeleteWishListCategoryWithItems {
  deleteWishListCategoryWithItems: DeleteWishListCategoryWithItem[]
}

export interface DeleteWishListCategoryWithItem {
  wishListCategoryId: number
  returnMessage: string
  wishListCategoryName: string
  isDefault: boolean
}

export interface CustomerWishItem {
  customerWishItems: CustomerWishItemElement[]
}

export interface CustomerWishItemElement {
  id: number
  name: string
  itemId: number
  variantid: number
  variantName: string
  size: string
  weight: string
  color: string
  material: string
  mrp: number
  savePrice: number
  savePricePctg: number
  price_regular: number
  price_member: number
  promo_price: number
  promo_name: null
  promo_percentage: null
  images: Image[]
  category: string
  brandicon: string
  desc: string
  item_code: string
  colorCode: string
  virtualTryOnType: string
  selectedVariant: boolean
  offer: Offer
  metaTagList: string[]
  stockQty: number
  itemRating: number
  customerWishItemId: number
  notifyOnArrival: boolean
  note: string
  wishListCategoryId: number
  wishListCategoryName: string
  isDefault: boolean
}

export interface Image {
  id: number
  name: string
  alt: string
  fullImagepath: string
}

export interface Offer {
  offerId: number
  offerName: string
  offerStartDate: string
  offerEndDate: string
  offerDescription: string
  offerDisclaimer: string
  offerIsPercentage: boolean
  offerValue: number
  offerSalePrice: number
  offerSavePrice: number
}
