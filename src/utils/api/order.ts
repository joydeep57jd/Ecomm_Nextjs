import {
  CheckoutOrderRequest,
  CheckoutOrderResponse,
  DeliveryChargeRequest,
  PlaceOrderResponse,
  PlaceOrderRequest,
  CustCancelRequest
} from "@/models/Order.model"
import axiosInstance from "../axiosInstance"
import API_URL from "../constants"
import { OrderPayload, OrderResponse } from "@/models/OrderHistory.modal"
import { OrderReturnPayload, ReturnWithImagePayload } from "@/models/Return.model"

export const getOrderHistory = async (payload: OrderPayload): Promise<OrderResponse> => {
  const { data } = await axiosInstance.post<{ data: OrderResponse }>(
    API_URL.ORDER.HISTORY_CUSTOMER,
    payload
  )
  return data.data
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

export const customerCancelRequest = async (payload: CustCancelRequest) => {
  await axiosInstance.post(API_URL.ORDER.CUST_CANCEL_REQUEST, payload)
}

export const GetStatementInvoice = async (invoiceNo: string) => {
  const { data } = await axiosInstance.post(API_URL.ORDER.INVOICE, { invoiceNo })
  return data
}

export const orderReturn = async (paylaod: OrderReturnPayload) => {
  const { data } = await axiosInstance.post(API_URL.ORDER.CUST_RETURN_ORDER, paylaod)
  return data.data
}


export const orderReturnImage = async(payload:ReturnWithImagePayload)=>{
  const {data} = await axiosInstance.post(API_URL.ORDER.CUST_RETURN_ORDERIMAGE,payload)
  return data.data
}
