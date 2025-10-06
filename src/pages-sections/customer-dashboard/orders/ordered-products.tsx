"use client"
import Image from "next/image"
import { format } from "date-fns/format"
// MUI
import Card from "@mui/material/Card"
import Button from "@mui/material/Button"
import Avatar from "@mui/material/Avatar"
import Typography from "@mui/material/Typography"
// GLOBAL CUSTOM COMPONENTS
import { FlexBetween, FlexBox } from "components/flex-box"
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib"
// CUSTOM DATA MODEL
import { OrderListCustomer, Item as Product } from "@/models/OrderHistory.modal"
import OrderItemRating from "./page-view/order-item-rating"
import { useState } from "react"
import { useUser } from "@/contexts/UserContenxt"
import { customerCancelRequest, GetStatementInvoice } from "@/utils/api/order"
import { CustCancelRequest } from "@/models/Order.model"
import { CircularProgress } from "@mui/material"

// ==============================================================
// PROPS
// ==============================================================
type Props = { order: OrderListCustomer }

// ==============================================================
// MAIN COMPONENT
// ==============================================================
export default function OrderedProducts({ order }: Props) {
  const { user } = useUser()

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [loadingInvoice, setLoadingInvoice] = useState(false)

  const handleCloseModal = (isReloadRequired: boolean) => {
    setSelectedProduct(null)
    console.warn(isReloadRequired)
  }

  const handleCancelOrder = async () => {
    const payload: CustCancelRequest = {
      OrderId: order.orderId,
      InvoiceId: order.invoiceId,
      OrderDetailId: order.orderDetailId,
      InvoiceDetailId: order.invoiceDetailId,
      Timestamp: new Date(),
      CancelReasonId: 1,
      Explanation: "Customer requested cancellation",
      UserId: user!.id,
      UserName: user!.firstName
    }

    await customerCancelRequest(payload)
  }



  const handleOpenInvoice = async () => {
  try {
    setLoadingInvoice(true)

    const encryptedOrderId = (order.orderId)


    const res = await GetStatementInvoice(order.orderId.toString())

 
    const decodedHtml = res.html ? atob(res.html) : res.html

    const newWindow = window.open("", "_blank")
    if (newWindow) {
      newWindow.document.write(decodedHtml)
      newWindow.document.title = `Invoice - ${order.custOrdNo}`
      newWindow.document.close()
    }
  } catch (error) {
    console.error("Error fetching invoice:", error)
  } finally {
    setLoadingInvoice(false)
  }
}


  return (
    <>
      <Card
        elevation={0}
        sx={{
          p: 0,
          mb: 4,
          border: "1px solid",
          borderColor: "grey.100"
        }}
      >
        <FlexBetween px={3} py={2} flexWrap="wrap" gap={1} bgcolor="grey.50">
          <Item title="Order ID:" value={order.custOrdNo} />
          <Item title="Placed on:" value={format(new Date(order.orderDate), "dd MMM, yyyy")} />

          {order.orderStatus === "Order Delivered" ? (
            <>
              <Button variant="outlined" color="primary" size="small">
                Return Order
              </Button>
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={handleOpenInvoice}
                disabled={loadingInvoice}
              >
                {loadingInvoice ? <CircularProgress size={16} color="inherit" /> : "View Invoice"}
              </Button>
            </>
          ) : (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleCancelOrder}
              disabled={order.isCancel}
            >
              Cancel Order
            </Button>
          )}
        </FlexBetween>

        {order.items.map((item, ind) => (
          <FlexBetween px={2} py={1} flexWrap="wrap" key={ind} gap={1}>
            <FlexBox gap={2} alignItems="center">
              <Avatar
                variant="rounded"
                sx={{
                  height: 60,
                  width: 60,
                  backgroundColor: "grey.50"
                }}
              >
                <Image
                  alt={item.imageAlt}
                  src={item.imageName}
                  width={50}
                  height={50}
                  style={{
                    height: 60,
                    width: 60,
                    borderRadius: "100%",
                    objectFit: "contain",
                    border: "1px solid #ead7d7"
                  }}
                />
              </Avatar>

              <div>
                <Typography noWrap variant="h6">
                  {item.name}
                </Typography>

                <Typography lineHeight={2} variant="body1" color="text.secondary">
                  {currency(item.price + item.tax)} x {item.qty}
                </Typography>
              </div>
            </FlexBox>

            <FlexBox gap={1}>
              <Button onClick={() => setSelectedProduct(item)} variant="text" color="primary">
                Write a Review
              </Button>

              {/* <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleCancelItem(item)}
              >
                Cancel
              </Button> */}
            </FlexBox>
          </FlexBetween>
        ))}
      </Card>

      {!!selectedProduct && (
        <OrderItemRating
          handleCloseModal={handleCloseModal}
          itemId={selectedProduct.itemId}
          variantId={selectedProduct.itemVariantId}
          product={selectedProduct}
        />
      )}
    </>
  )
}

// ==============================================================
// SMALL ITEM COMPONENT
// ==============================================================
function Item({ title, value }: { title: string; value: string }) {
  return (
    <FlexBox gap={1} alignItems="center">
      <Typography variant="body1" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </FlexBox>
  )
}
