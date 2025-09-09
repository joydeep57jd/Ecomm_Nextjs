import axiosInstance from "../axiosInstance"
// import axios from "../axiosInstance"
import { API_URL } from "../constants"

export const homePage = async () => {
  const response = await axiosInstance.post(API_URL.ITEMS.P_ALLPRODUCT, {})
  return response.data
}
