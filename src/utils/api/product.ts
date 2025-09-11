import API_URL from "../constants"
import axios from "../axiosInstance"
import { AllProductResponse, ProductRequestPayload } from "@/models/AllProduct.model"
import { SingleProductResponse, VariantOption } from "@/models/SingleProduct.model"

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

export const getProduct = async (optionValues: string) => {
  const { data } = await axios.post<{ data: SingleProductResponse }>(
    API_URL.ITEMS.GET_VARIANT_BY_OPTIONS,
    {
      optionValues
    }
  )
  return data.data
}
