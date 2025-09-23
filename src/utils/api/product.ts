import API_URL from "../constants"
import axios from "../axiosInstance"
import { AllProductResponse, ProductRequestPayload } from "@/models/AllProduct.model"
import { AddInfoPayload, SingleProductResponse, VariantOption } from "@/models/SingleProduct.model"
import { Cart } from "@/models/CartProductItem.models"
import { GetCategoryResponse } from "@/models/Category.modal"
import axiosInstance from "../axiosInstance"
import { CategoryWiseFilter, CategoryWiseFilterResponse } from "@/models/Filters"

export const getAllProducts = async (body: ProductRequestPayload) => {
  const { data } = await axios.post<{ data: AllProductResponse }>(API_URL.ITEMS.GET_SEARCH, body)
  return data.data
}

export const getVariantOption = async (slug: string) => {
  const { data } = await axios.post<{ data: VariantOption[] }>(API_URL.ITEMS.GET_FILTER_OPTIONS, {
    itemId: +slug
  })
  return data.data
}

export const getProduct = async ({
  itemVariantId,
  optionValues
}: {
  itemVariantId?: number
  optionValues?: string
}) => {
  const payload = {
    ItemVariantId: itemVariantId ?? 0,
    OptionValues: optionValues ?? ""
  }

  // console.log("Payload:", payload)

  const { data } = await axios.post<{ data: SingleProductResponse }>(
    API_URL.ITEMS.GET_VARIANT_BY_OPTIONS,
    payload
  )

  // console.log("Response:", data)

  return data.data
}

export const getOptionsByCategory = async (CategoryId: number) => {
  const { data } = await axios.post<{ data: GetCategoryResponse[] }>(
    API_URL.ITEMS.GET_CATEGORY_OPTIONS,
    { CategoryId }
  )
  return data.data
}

export const getFilterCategorySection = async (payload: CategoryWiseFilter) => {
  const { data } = await axios.post<{ data: CategoryWiseFilterResponse[] }>(
    API_URL.ITEMS.GET_FILTER_CATEGORY_SECTION,
    payload
  )
  return data.data
}

export const isProductAddedToCart = (cart: Cart[], variantId: number, productId: number) => {
  const cartProduct = cart.find((p) => variantId === p.itemVariantId && +productId === p.productId)
  return !!cartProduct
}

export const getAdditionalInfoByItem = async (payload: AddInfoPayload) => {
  const { data } = await axiosInstance.post<{}>(API_URL.ITEMS.GET_ADDITIONAL_INFO, payload)
  return data
}

export const getFAQ = async (ItemId: number) => {
  const { data } = await axiosInstance.post<{}>(API_URL.MISC.GET_FAQ, ItemId)
  return data
}
