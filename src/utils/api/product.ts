import API_URL from "../constants"
import axios from "../axiosInstance"
import { AllProductResponse, ProductRequestPayload } from "@/models/AllProduct.model"



const getAllProducts =  (params: ProductRequestPayload) => {
  return  axios.get<AllProductResponse>(API_URL.ITEMS.GET_SEARCH, {
    params,
  })
  
}

export default { getAllProducts }