import { DataList } from "./AllProduct.model"

interface Item {
  label: string
  value: string
}

interface Category {
  title: string
  children?: string[]
}

export default interface Filters {
  brands: Item[]
  others: Item[]
  colors: string[]
  categories: Category[]
}

export interface CategoryWiseFilter {
  OptionValueIds: string
  ItemOptionValueIds:string
  PageNo: number
  PageSize: number
}

export interface CategoryWiseFilterResponse {
  variantDetails: VariantDetail[]
  dataList: DataList[]
  pagination: Paginantion
<<<<<<< HEAD
<<<<<<< Updated upstream
=======
=======
>>>>>>> 527dcf6f6e32b8d3026e2eece2bac0137d7a4f91
  variantOptionDetails: VariantOptionDetails[]
}

export interface VariantOptionDetails {
  itemVariantId: number
  variantOptionId: number
  optionName: string
  variantOptionValueId: number
  optionValue: string
<<<<<<< HEAD
  
>>>>>>> Stashed changes
=======
>>>>>>> 527dcf6f6e32b8d3026e2eece2bac0137d7a4f91
}

export interface VariantDetail {
  id: number
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
  batchInfos: BatchInfos[]
  imageList: ImageList[]
}

export interface BatchInfos {
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

export interface ImageList {
  id: number
  name: string
  alt: string
  fullImagepath: string
}

export interface Paginantion {
  pageNumber: number
  pageSize: number
  totalRecords: number
}
