"use client"

import Loading from "@/app/loading"
import { useUser } from "@/contexts/UserContenxt"
import { OrderResponse } from "@/models/OrderHistory.modal"
import { getOrderHistory } from "@/utils/api/order"
import { Box } from "@mui/material"
import { OrdersPageView } from "pages-sections/customer-dashboard/orders/page-view"
import { useEffect, useState } from "react"
// API FUNCTIONS

export default function Orders() {
  const pageSize = 5

  const { user } = useUser()
  const [currentPage, setCurrentPage] = useState(1)
  const [orderResponse, setOrderResponse] = useState<OrderResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getOrderList()
  }, [currentPage])

  const getOrderList = async () => {
    setIsLoading(true)
    const data = await getOrderHistory({
      RecordFrom: (currentPage - 1) * pageSize + 1,
      RecordTo: pageSize * currentPage,
      UserId: user!.id,
      CustOrdNo: ""
    })
    setOrderResponse(data)
    setIsLoading(false)
  }

  if (!orderResponse) {
    return <Loading isSmallLoader={!orderResponse} />
  }

  return (
    <Box sx={{ position: "relative" }}>
      {isLoading && (
        <Box
          sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        >
          <Loading isTiny={true} />
        </Box>
      )}
      <OrdersPageView
        orders={orderResponse!.orderListCustomer}
        totalPages={Math.ceil(orderResponse!.count / pageSize)}
        setCurrentPage={setCurrentPage}
      />
    </Box>
  )
}
