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
import Link from "next/link"


// ==============================================================
// PROPS
// ==============================================================
type Props = { order: OrderListCustomer; refreshOrder: () => void }

// ==============================================================
// MAIN COMPONENT
// ==============================================================
export default function OrderedProducts({ order, refreshOrder }: Props) {
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

      await refreshOrder()
    } catch (error) {
      console.error("Cancel order failed:", error)
    } finally {
      setLoadingCancelId(null)
    }
  }

  const handleOpenInvoice = async () => {
    try {
      setLoadingInvoice(true)
      const invoiceNo = order.items?.find(item=>item.invoiceNumber)?.invoiceNumber!
      const res = await GetStatementInvoice(invoiceNo)

      const htmlc = res.html

      const newWindow = window.open("", "_blank")
      if (newWindow) {
        newWindow.document.write(htmlc)
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

  const isDelivered = (item: Product) => item.status?.toLowerCase().includes("delivered")

  const isCancelled = (item: Product) => item.status?.toLowerCase().includes("cancel")

  // const hasInvoice = !!order.items.find((item)=>item.invDate)

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
        </FlexBetween>

        {order.items.map((item, ind) => (
          <FlexBetween key={ind} px={2} py={1} flexWrap="wrap" gap={1}>
               <Link href={`/products/${item.itemId}${item.itemId ? `?variantId=${item.itemVariantId}` : ''}`}>
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
              </Link>

            <FlexBox gap={1}>
              {isDelivered(item) ? (
                <>
                 <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleOpenInvoice}
                    disabled={loadingInvoice}
                  >
                    {loadingInvoice ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      "View Invoice"
                    )}
                  </Button>
                  
                  <Button variant="outlined" color="primary" size="small">
                    Return Order
                  </Button>

                  
                  <Button onClick={() => setSelectedProduct(item)} variant="text" color="primary">
                    Write a Review
                  </Button>

                 
                 
                </>
              ) : isCancelled(item) ? (
                <Typography variant="body2" color="error" fontWeight={500}>
                  {item.status}
                </Typography>
              ) : !item.invDate ? (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  disabled={loadingCancelId === item.orderDetailId}
                  onClick={() => handleCancelOrder(item)}
                >
                  {loadingCancelId === item.orderDetailId ? (
                    <FlexBox gap={1} alignItems="center">
                      <CircularProgress size={16} color="inherit" />
                      <Typography variant="caption">Cancelling...</Typography>
                    </FlexBox>
                  ) : (
                    "Cancel Item"
                  )}
                </Button>
              ) : (
                <Typography color="text.secondary">{item.status}</Typography>
              )}
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
