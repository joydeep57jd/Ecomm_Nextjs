"use client"

// API FUNCTIONS
// CUSTOM DATA MODEL
import { getOrderHistory, getOrderPaymentAndAddress } from "@/utils/api/order"
import { OrderDetailsPageView } from "@/pages-sections/customer-dashboard/orders/page-view"
import { useUser } from "@/contexts/UserContenxt"
import { useEffect, useState } from "react"
import { GetOrderPaymentAndAddressResponse, OrderListCustomer, OrderResponse } from "@/models/OrderHistory.modal"
import {  useSearchParams } from "next/navigation"
import Loading from "@/app/loading"

export default  function OrderDetails() {
  const [singleOrderResponse, setSingleOrderResponse] = useState<OrderListCustomer | null>(null)
  const [ singleOrderPaymentAndAddress, setSingleOrderPaymentAndAddress] = useState<GetOrderPaymentAndAddressResponse | null>(null)
  const [ paymentAndAddressLoading, setPaymentAndAddressLoading] = useState(true)
  const { user } = useUser()
  const params = useSearchParams()
  const id:string = params.get("id") || ""
  

  useEffect(() => {
    if (id) {
      getOrderList()
    }
  }, [id])

  const getOrderList = async () => {

    const data: OrderResponse = await getOrderHistory({
      RecordFrom: 0,
      RecordTo: 0,
      UserId: user!.id,
      CustOrdNo: atob(id!)
    })


    if (data.orderListCustomer?.length > 0) {
      const order = data.orderListCustomer[0]
      setSingleOrderResponse(order)
      getPaymentAndAddress(order.orderId)
    }
  }

  const getPaymentAndAddress = async (orderId: number) => {
    try {
      setPaymentAndAddressLoading(true)
      const data = await getOrderPaymentAndAddress(orderId)
      setSingleOrderPaymentAndAddress(data)
    } finally {
      setPaymentAndAddressLoading(false)
    }
  }

  if(!singleOrderResponse) {
    return <Loading isSmallLoader={true}/>
  }

  return (
    <OrderDetailsPageView
      order={singleOrderResponse!}
      paymentAndAddress={singleOrderPaymentAndAddress}
      paymentAndAddressLoading={paymentAndAddressLoading}
      refreshOrder={getOrderList}
    />
  )
}
