import { Metadata } from "next"
// API FUNCTIONS
// CUSTOM DATA MODEL
import { IdParams } from "models/Common"
import { getOrderDetail } from "@/utils/api/order"
import { OrderDetailsPageView } from "@/pages-sections/customer-dashboard/orders/page-view"

export async function generateMetadata({ params }: IdParams): Promise<Metadata> {
  const { id } = await params
  const order = await getOrderDetail(+id)

  return {
    title: order.custOrdNo + "",
    description: "Order Details.",
  }
}

export default async function OrderDetails({ params }: IdParams) {
  const { id } = await params
  const order = await getOrderDetail(+id)

  return <OrderDetailsPageView order={order} />
}
