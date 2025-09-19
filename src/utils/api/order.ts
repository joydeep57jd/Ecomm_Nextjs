import {
  CheckoutOrderRequest,
  CheckoutOrderResponse,
  DeliveryChargeRequest,
  PlaceOrderResponse,
  PlaceOrderRequest
} from "@/models/Order.model"
import axiosInstance from "../axiosInstance"
import API_URL from "../constants"
import { OrderPayload, OrderResponse } from "@/models/OrderHistory.modal"

export const GetOrderHistory = async (payload: OrderPayload): Promise<OrderResponse> => {
  const { data } = await axiosInstance.post<OrderResponse>(API_URL.ORDER.HISTORY, payload)
  return data
}

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

export const placeOrder = async (payload: PlaceOrderRequest) => {
  const { data } = await axiosInstance.post<{ data: PlaceOrderResponse }>(
    API_URL.ORDER.PLACE_ORDER,
    payload
  )
  return data.data
}
