import API_URL from "../constants"
import axios from "../axiosInstance"
import { AllProductResponse, ProductRequestPayload } from "@/models/AllProduct.model"

export const getAllProducts = async (body: ProductRequestPayload) => {
  const { data } = await axios.post<{ data: AllProductResponse }>(API_URL.ITEMS.GET_SEARCH, body)
  return data.data
}
