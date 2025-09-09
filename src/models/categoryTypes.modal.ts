/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CategoryResponse {
  id: string
  name: string
  icon: string
  iconImage: string
  sub_category: SubCategory[]
}

export interface SubCategory {
  id: string
  name: string
  iconImageSubCategory: string
  subCategoryItem: SubCategoryItem[]
  sub_sub_category: SubSubCategory[]
}

export interface SubCategoryItem {
  itemId: number
  name: string
  itemCode: string
  fullImagepath: string
}

export interface SubSubCategory {
  id: string
  name: string
  iconimagesubSubCategory: string
  subSubCategoryItem: any[]
}
