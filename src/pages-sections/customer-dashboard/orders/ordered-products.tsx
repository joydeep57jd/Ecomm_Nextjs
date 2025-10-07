"use client"
import Image from "next/image"
import { format } from "date-fns"
// MUI
import Card from "@mui/material/Card"
import Button from "@mui/material/Button"
import Avatar from "@mui/material/Avatar"
import Typography from "@mui/material/Typography"
import { CircularProgress } from "@mui/material"
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
import { OrderStatus } from "@/enums/order-status.enum"

// ==============================================================
// PROPS
// ==============================================================
type Props = { order: OrderListCustomer
   refreshOrder: () => void 
 }

// ==============================================================
// MAIN COMPONENT
// ==============================================================
export default function OrderedProducts({ order,refreshOrder }: Props) {
  const { user } = useUser()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [loadingInvoice, setLoadingInvoice] = useState(false)
  const [loadingCancelId, setLoadingCancelId] = useState<number | null>(null) 

  const handleCloseModal = (isReloadRequired: boolean) => {
    setSelectedProduct(null)
    console.warn(isReloadRequired)
  }

  const handleCancelOrder = async (item: Product) => {
    try {
      setLoadingCancelId(item.orderDetailId) 

      const payload: CustCancelRequest = {
        OrderId: order.orderId,
        InvoiceId: null, 
        OrderDetailId: item.orderDetailId,
        InvoiceDetailId: null, 
        Timestamp: new Date(),
        CancelReasonId: 1,
        Explanation: "Customer requested cancellation",
        UserId: user!.id,
        UserName: user!.firstName
      }

      await customerCancelRequest(payload)

     
       refreshOrder() 
    } catch (error) {
      console.error("Cancel order failed:", error)
    } finally {
      setLoadingCancelId(null)
    }
  }

  const handleOpenInvoice = async () => {
    try {
      setLoadingInvoice(true)

      const res = await GetStatementInvoice(order.orderId.toString())

      const decodedHtml = atob(res.html)

      const newWindow = window.open("", "_blank")
      if (newWindow) {
        newWindow.document.write(decodedHtml)
        newWindow.document.title = `Invoice - ${order.custOrdNo}`
        newWindow.document.close()
      } else {
        console.error("Unable to open new tab")
      }
    } catch (error) {
      console.error("Error fetching invoice:", error)
    } finally {
      setLoadingInvoice(false)
    }
  }
  

  const isDelivered = order.orderStatus === OrderStatus.DELIVERED
  const hasInvoice = !!order.isInvoiced

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

          {isDelivered && (
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={handleOpenInvoice}
              disabled={loadingInvoice}
            >
              {loadingInvoice ? <CircularProgress size={16} color="inherit" /> : "View Invoice"}
            </Button>
          )}
        </FlexBetween>

        {order.items.map((item, ind) => (
          <FlexBetween key={ind} px={2} py={1} flexWrap="wrap" gap={1}>
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
                  width={60}
                  height={60}
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
              {isDelivered ? (
                <>
                  <Button variant="outlined" color="primary" size="small">
                    Return Order
                  </Button>

                  <Button onClick={() => setSelectedProduct(item)} variant="text" color="primary">
                    Write a Review
                  </Button>
                </>
              ) : !hasInvoice ? (
                
                item.status.toLowerCase().includes("cancel") ? (
                  <Typography variant="body2" color="error" fontWeight={500}>
                    {item.status}
                  </Typography>
                ) : (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    disabled={loadingCancelId === item.orderDetailId}
                    onClick={() => handleCancelOrder(item)}
                  >
                    {loadingCancelId === item.orderDetailId ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      "Cancel Invoice"
                    )}
                  </Button>
                )
              ) : null}
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
