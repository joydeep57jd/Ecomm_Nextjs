"use client"

// API FUNCTIONS
// CUSTOM DATA MODEL
import { getOrderHistory } from "@/utils/api/order"
import { OrderDetailsPageView } from "@/pages-sections/customer-dashboard/orders/page-view"
import { useUser } from "@/contexts/UserContenxt"
import { useEffect, useState } from "react"
import { OrderListCustomer, OrderResponse } from "@/models/OrderHistory.modal"
import {  useSearchParams } from "next/navigation"
import Loading from "@/app/loading"


// export async function generateMetadata({ params }: IdParams): Promise<Metadata> {
//   const { id } = await params
//   const order = await getOrderDetail(+id)

//   return {
//     title: order.custOrdNo + "",
//     description: "Order Details.",
//   }
// }

export default  function OrderDetails() {
  const [singleOrderResponse, setSingleOrderResponse] = useState<OrderListCustomer | null>(null)
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
      setSingleOrderResponse(data.orderListCustomer[0])
    }
  }

  if(!singleOrderResponse) {
    return <Loading isSmallLoader={true}/>
  }

  return <OrderDetailsPageView order={singleOrderResponse!}   refreshOrder={getOrderList}/>
}
