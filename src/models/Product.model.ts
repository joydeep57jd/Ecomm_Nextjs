import Shop from "./Shop.model"
import Review from "./Review.model"

export default interface Product {
  unit?: string
  slug: string | number
  price: number
  title: string
  rating?: number
  discount: number
  thumbnail: string
  description?: string
  id: string
  shop?: Shop
  brand?: string
  size?: string[]
  status?: string
  colors?: string[]
  images: string[]
  categories: string[]
  reviews?: Review[]
  published?: boolean
}
