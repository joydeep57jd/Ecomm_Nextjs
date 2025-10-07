import { Fragment } from "react"
// LOCAL CUSTOM COMPONENTS
import OrderSummery from "../order-summery"

import OrderedProducts from "../ordered-products"
import DashboardHeader from "../../dashboard-header"
// CUSTOM DATA MODEL
import { OrderListCustomer } from "@/models/OrderHistory.modal"

// import OrderProgress from "../order-progress"

// =============================================================
type Props = { order: OrderListCustomer
   refreshOrder: () => void };
// =============================================================

export function OrderDetailsPageView({ order, refreshOrder }: Props) {
  return (
    <Fragment>
      <DashboardHeader href="/orders" title="Order Details" />

{/* <OrderProgress
        status={order.orderStatus}
        // deliveredAt={order.deliveredAt}
        // isDelivered={order.isDelivered}
      /> */}

      <OrderedProducts order={order} refreshOrder={refreshOrder} />

      <OrderSummery order={order} />
    </Fragment>
  )
}
