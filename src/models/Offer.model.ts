export interface BannerOfferResponse {
  offerId: number
  offerName: string
  bannerImageUrl: string
  discountPercentage: number
  offerIconUrl:string
}

export interface GetProductOfferResponse {
  totalRecords: number
  items: Item[]
}

export interface Item {
  totalRecords: number
  itemId: number
  itemVariantId: number
  itemVariantName: string
  mrp: number
  sellingPrice: number
  appliedOfferDiscount: number
  primaryImageUrl: string
  finalSalePrice: number
  stockQty?: number
  itemRating: number
  reviewCount: number
}
