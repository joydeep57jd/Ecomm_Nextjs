export interface ProductImage {
  id: number
  alt: string | null
  fullImagepath: string
  name: string | null
}

export interface SectionItem {
  itemId: number
  name: string
  mrp: number
  price: number
  salePrice: number
  imagePath: string
  images?: ProductImage[]
  offer?: string
}

export interface Section {
  companyTemplateSectionId: number
  sectionType: number
  sectionName: string
  responseSectionItemAndImage?: {
    sectionItems: SectionItem[]
  }
}

export interface Props {
  title?: string
  imgUrl: string
  alt?: string
  buttonLink?: string
  buttonText?: string
  description?: string
  buttonColor?: "dark" | "primary"
}

export interface Product {
  id: string
  slug: string
  title: string
  price: number
  thumbnail: string
  images: string[]
  discount: number
  categories: string[]
  rating?: number
  offer?: string
}
