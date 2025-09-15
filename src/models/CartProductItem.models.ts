export interface CartProductItem {
  quantity: number
  batchId: number
  id: number
  name: string
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
  colorCode: null
  virtualTryOnType: null
  selectedVariant: boolean
  offer: Offer
  metaTagList: null
  tagList: null
  stockQty: number
  itemRating: number
  isWishListAdded: boolean
  customerWishItemId: number
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

export interface GuestCartItem {
  itemId: number
  itemVariantId: number
  itemQty: number
  itemPrice: number
}

export interface AddToCartRequest {
  customerid: number

  userId: string
  carttItemVariant: GuestCartItem[]
}

export interface Cart {
  productId: number
  productName: string
  productPrice: number
  qty: number
  productImage: string
  itemVariantId: number
  stockQty?: number
  mrp:number
   variantName:string
  
}

export interface RemoteCart {
  quantity: number
  batchId: number
  id: number
  name: string
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
  colorCode: null
  virtualTryOnType: null
  selectedVariant: boolean
  offer: Offer
  metaTagList: null
  tagList: null
  stockQty: number
  itemRating: number
  isWishListAdded: boolean
  customerWishItemId: number
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
