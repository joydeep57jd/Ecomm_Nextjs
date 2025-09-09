import LayoutModel from "@/models/Layout.model"
import axios from "../axiosInstance"
// CUSTOM DATA MODEL

import { API_URL } from "../constants"
import { Category } from "@/models/Category.modal"

const getCategories = async (): Promise<LayoutModel> => {
  const response = await axios.post<{ data: Category[] }>(`${API_URL.ITEMS.GET_CATEGORY}`, {})
  return {
    header: {
      categories: [],
      categoryMenus: [],
      logo: "/logo.png",
      navigation: response.data.data
    }
  }
}

export default { getLayoutData: getCategories }
