import LayoutModel from "@/models/Layout.model"
import axios from "../axiosInstance"
// CUSTOM DATA MODEL

import { API_URL } from "../constants"
import { Category } from "@/models/Category.modal"

const getLayoutData = async (): Promise<LayoutModel> => {
  let categories: Category[] = []

  const [categoryResponse] = await Promise.allSettled([
    axios.post<{ data: Category[] }>(`${API_URL.ITEMS.GET_CATEGORY}`, {})
  ])

  if (categoryResponse.status === "fulfilled") {
    categories = categoryResponse.value.data.data
  }

  return {
    header: {
      categories: [],
      categoryMenus: [],
      logo: "/logo.png",
      navigation: categories
    }
  }
}

export default { getLayoutData }
