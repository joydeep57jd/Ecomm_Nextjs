import { Fragment } from "react"
// CUSTOM COMPONENTS
import Packages from "icons/Packages"
import OrderRow from "../order-row"
import Pagination from "../../pagination"
import DashboardHeader from "../../dashboard-header"
// CUSTOM DATA MODEL
import { OrderListCustomer } from "@/models/OrderHistory.modal"

// ====================================================
interface Props {
  orders: OrderListCustomer[];
  totalPages: number;
  setCurrentPage(page: number): void
}
// ====================================================

export function OrdersPageView({ orders, totalPages, setCurrentPage }: Props) {
  return (
    <Fragment>
      <DashboardHeader Icon={Packages} title="My Orders" />

      {orders.map((order) => (
        <OrderRow order={order} key={order.orderId} />
      ))}

      <Pagination count={totalPages} setCurrentPage={setCurrentPage} />
    </Fragment>
  )
}
