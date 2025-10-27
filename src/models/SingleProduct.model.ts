export interface ProductDetailsRequest {
  itemId: number
}

export interface VariantOption {
  variantOptionId: number
  variantOptionValueId: number
  optionValue: string
  optionName: string
  appliedOnVariant: boolean

}

export interface SingleProductResponse {
  priceAndStock: PriceAndStock
  variantDetails: VariantDetails
  imageList: ImageList[]
  variantOptionList: VariantOption[]
}

export interface ImageList {
  id: number
  name: string
  alt: string
  fullImagepath: string
}

export interface VariantDetails {
  id: string
  itemId: number
  itemName: string
  itemDesc: string
  itemVariantId: number
  variantName: string
  variantSortOrderInCategory: number
  categoryId: number
  subCategoryId: number
  brandLogoFileName: string
  isSoldOut: boolean
  itemCode: string
  itemRating: number
  reviewCount:number

}

export interface PriceAndStock {
  itemVariantId: number
  memberPrice: number
  mrp: number
  salePrice: number
  savePrice: number
  savePricePctg: number
  physicalQty: number
  reservedQty: number
  stockQty: number
  batchId: number
}

export interface AddInfoPayload {
  variant: number[]
  itemId: number
}
