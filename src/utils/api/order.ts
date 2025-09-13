import { CheckoutOrderRequest, CheckoutOrderResponse } from "@/models/Order.model"
import axiosInstance from "../axiosInstance"
import API_URL from "../constants"

export const getOrderSummary = async (paylaod: CheckoutOrderRequest) => {
  const { data } = await axiosInstance.post<{ data: CheckoutOrderResponse }>(
    API_URL.ORDER.CHECKOUT,
    paylaod
  )
  return data.data
}
