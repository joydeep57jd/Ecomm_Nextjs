
import axios from "../axiosInstance"
// CUSTOM DATA MODEL

import {API_URL} from "../constants"
import { CategoryResponse } from "@/models/categorytypes.modal"

const getCategories = async () => {
  const response = await axios.post<CategoryResponse[]>(`${API_URL.ITEMS.GET_CATEGORY}`, {})
  return response.data
}

export default { getLayoutData: getCategories }
