export interface BannerOfferResponse {
  offerId: number
  offerName: string
  bannerImageUrl: string
  discountPercentage: number
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
}
