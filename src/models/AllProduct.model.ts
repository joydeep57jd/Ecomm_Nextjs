export interface AllProductResponse {
  dataList: DataList[]
  pagination: Pagination
}

export interface DataList {
  id: number
  itemId: number
  itemName: string
  itemDesc: string
  mrp: number
  savePrice: number
  savePricePctg: number
  memberPrice: number
  categoryId: number
  subCategoryId: number
  isSoldOut: boolean
  itemCode: string
  imageList: ImageList[]
}

export interface HomePageProduct {
  companyTemplateSectionItemMappingId: number
  itemId: number
  variantId: number
  isActive: boolean
  primaryText: null
  secondaryText: null
  tertiaryText: null
  displayOrder: number
  name: string
  imagePath: string
  price: number
  mrp: number
  salePrice: number
  taxPercentage: number
  membrPrice: number
  images: Image[]
  offer: null
  stockQty: number
}

export interface Image {
  id: number
  name: null
  alt: string
  fullImagepath: string
}

export interface ImageList {
  id: number
  name: string
  alt: string
  fullImagepath: string
}

export interface Pagination {
  pageNumber: number
  pageSize: number
  totalRecords: number
}

export interface ProductRequestPayload {
  searchCriteria?: string | null
  categoryId?: number
  subCategoryId?: number | null
  optionValueIds?: string | null
  pageNo?: number | null
  pageSize?: number | null
}
