import {
  CheckoutOrderRequest,
  CheckoutOrderResponse,
  DeliveryChargeRequest
} from "@/models/Order.model"
import axiosInstance from "../axiosInstance"
import API_URL from "../constants"

export const getOrderSummary = async (paylaod: CheckoutOrderRequest) => {
  const { data } = await axiosInstance.post<{ data: CheckoutOrderResponse }>(
    API_URL.ORDER.CHECKOUT,
    paylaod
  )
  return data.data
}

export const getDeliveryCharge = async (payload: DeliveryChargeRequest) => {
  const { data } = await axiosInstance.post<{ data: string }>(
    API_URL.ORDER.GET_DELIVEY_CHARGE,
    payload
  )
  return data.data
}
