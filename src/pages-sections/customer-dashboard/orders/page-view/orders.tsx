import { Fragment } from "react"
// CUSTOM COMPONENTS
import Packages from "icons/Packages"
import OrderRow from "../order-row"
import Pagination from "../../pagination"
import DashboardHeader from "../../dashboard-header"
// CUSTOM DATA MODEL
import { OrderListCustomer } from "@/models/OrderHistory.modal"
import { Typography } from "@mui/material"

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

     
      {orders?.length === 0 ? (
        <Typography textAlign="center" my={4} variant="h5">
          No orders found!
        </Typography>
      ) : (
        <>
          {orders?.map((order, index) => (
            <OrderRow order={order} key={index} />
          ))}
          <Pagination count={totalPages} setCurrentPage={setCurrentPage} />
        </>
      )}
    </Fragment>
  )
}
