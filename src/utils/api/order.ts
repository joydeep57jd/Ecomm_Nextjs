import {
  CheckoutOrderRequest,
  CheckoutOrderResponse,
  DeliveryChargeRequest,
  PlaceOrderResponse,
  PlaceOrderRequest,
  CustCancelRequest,
  StatmentInvoiceResponse
} from "@/models/Order.model"
import axiosInstance from "../axiosInstance"
import API_URL from "../constants"
import {  OrderPayload, OrderResponse } from "@/models/OrderHistory.modal"

export const getOrderHistory = async (payload: OrderPayload): Promise<OrderResponse> => {
  const { data } = await axiosInstance.post<{ data: OrderResponse }>(
    API_URL.ORDER.HISTORY_CUSTOMER,
    payload
  )
  return data.data
}

// export const getOrderDetail = async (orderId: number): Promise<OrderListCustomer> => {
//   // const { data } = await axiosInstance.post<{ data: OrderListCustomer }>(
//   //   API_URL.ORDER.ORDER_DETAIL,
//   //   { orderId }
//   // )
//   return {
//     custOrdNo: "ORD/SpSHOP/2023-24/340",
//     orderDateStr: "15/09/2025 10:20 PM",
//     invoiceNumber: "ORD/SpSHOP/2023-24/340/1",
//     orderStatus: "Order Processed",
//     invoiceDate: "15/09/2025 10:23 PM",
//     items: [
//       {
//         name: "GA-WO-25-40 - Kurtas & Suits",
//         lastReturnDate: "",
//         isReturn: false,
//         itemId: 1523,
//         itemVariantId: 3577,
//         color: "",
//         size: "",
//         imageName:
//           "https://qalibrary.uvanij.com/company/consas/images/Item/Original/81XNBEzOZeL._UY1100_.jpg",
//         imageAlt: "Kurtas & Suits",
//         qty: 1,
//         rating: 0,
//         price: 2327.59,
//         tax: 372.41,
//         taxRate: 16,
//         invQty: 1,
//         invDate: "15/09/2025 10:23 PM",
//         status: "Delivered"
//       },
//       {
//         name: "GR-VE-25-38 - TOMATO",
//         lastReturnDate: "",
//         isReturn: false,
//         itemId: 1521,
//         itemVariantId: 3575,
//         color: "",
//         size: "",
//         imageName:
//           "https://qalibrary.uvanij.com/company/consas/images/Item/Original/istockphoto-468168962-612x612.jpg",
//         imageAlt: "TOMATO",
//         qty: 1,
//         rating: 0,
//         price: 32.76,
//         tax: 5.24,
//         taxRate: 16,
//         invQty: 1,
//         invDate: "15/09/2025 10:23 PM",
//         status: "Delivered"
//       }
//     ],
//     orderDate: new Date("2025-09-15T22:20:36.367"),
//     subTotal: "2360.35",
//     tax: "377.65",
//     discount: "0.00",
//     delvCharge: "0.00",
//     total: "2738.00",
//     orderId: orderId,
//     totalInvoiceAmount: "2738.00",
//     paidAmount: "0",
//     isCancel: false,
//     cancelDate: "",
//     isInvoiced: true
//   }
// }

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


export const customerCancelRequest = async(payload:CustCancelRequest)=>{
 await axiosInstance.post(API_URL.ORDER.CUST_CANCEL_REQUEST,payload)

}


export const GetStatementInvoice = async(orderId:string)=>{
    const {data} =await axiosInstance.post<{data:StatmentInvoiceResponse}>(API_URL.ORDER.INVOICE,{orderId})
    return data.data
}

