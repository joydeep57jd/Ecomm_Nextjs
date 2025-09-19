import API_URL from "../constants"
import axios from "../axiosInstance"
import { AllProductResponse, ProductRequestPayload } from "@/models/AllProduct.model"
import { SingleProductResponse, VariantOption } from "@/models/SingleProduct.model"
import { Cart } from "@/models/CartProductItem.models"
import { GetCategoryResponse } from "@/models/Category.modal"


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


export const getOptionsByCategory = async(CategoryId:number)=>{
  const {data} = await axios.post<{data:GetCategoryResponse[]}>(
    API_URL.ITEMS.GET_CATEGORY_OPTIONS,{CategoryId}
  )
  return data.data
}

export const isProductAddedToCart = (cart: Cart[], variantId: number, productId: number) => {
  const cartProduct = cart.find((p) => variantId === p.itemVariantId && +productId === p.productId)
  return !!cartProduct
}


