import { Fragment } from "react"
// LOCAL CUSTOM COMPONENTS
import OrderSummery from "../order-summery"

import OrderedProducts from "../ordered-products"
import DashboardHeader from "../../dashboard-header"
// CUSTOM DATA MODEL
import { GetOrderPaymentAndAddressResponse, OrderListCustomer } from "@/models/OrderHistory.modal"
import OrderProgress from "../order-progress"

// import OrderProgress from "../order-progress"

// =============================================================
type Props = {
  order: OrderListCustomer
  paymentAndAddress: GetOrderPaymentAndAddressResponse | null
  paymentAndAddressLoading?: boolean
  refreshOrder: () => void
}
// =============================================================

export function OrderDetailsPageView({
  order,
  paymentAndAddress,
  paymentAndAddressLoading,
  refreshOrder
}: Props) {
  return (
    <Fragment>
      <DashboardHeader href="/orders" title="Order Details" />

      <OrderProgress
        order={order}
        statusTrack={paymentAndAddress?.statusTrack}
        statusLoading={paymentAndAddressLoading}
      />

      <OrderedProducts order={order} refreshOrder={refreshOrder} />

      <OrderSummery order={order} paymentAndAddress={paymentAndAddress} />
    </Fragment>
  )
}
