"use client"
import Image from "next/image"
import { format } from "date-fns"
// MUI
import Card from "@mui/material/Card"
import Button from "@mui/material/Button"
import Avatar from "@mui/material/Avatar"
import Typography from "@mui/material/Typography"
import { CircularProgress, Chip, Box } from "@mui/material"
// GLOBAL CUSTOM COMPONENTS
import { FlexBetween, FlexBox } from "components/flex-box"
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib"
// CUSTOM DATA MODEL
import { OrderListCustomer, Item as Product } from "@/models/OrderHistory.modal"
import OrderItemRating from "./page-view/order-item-rating"
import { useState, useEffect } from "react"
import { useUser } from "@/contexts/UserContenxt"
import { customerCancelRequest, GetStatementInvoice, orderReturnPickupOtp } from "@/utils/api/order"
import { CustCancelRequest } from "@/models/Order.model"
import Link from "next/link"
import OrderItemReturn from "./page-view/order-item-return"
import CancelItem from "./page-view/cancel-item"

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
  const [loadingInvoiceId, setLoadingInvoiceId] = useState<number | null>(null)
  const [loadingCancelId, setLoadingCancelId] = useState<number | null>(null)
  const [modalType, setModalType] = useState<"rating" | "return" | "cancel" | null>(null)
  const [returnPickupOtps, setReturnPickupOtps] = useState<{ [key: number]: string }>({})
  const [render, setRender] = useState<Record<number, boolean>>({})

  const handleCloseModal = (isReloadRequired: boolean) => {
    setSelectedProduct(null)
    setModalType(null)
    if (isReloadRequired) refreshOrder()
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
      handleCloseModal(true)
    } catch (error) {
      console.error("Cancel order failed:", error)
    } finally {
      setLoadingCancelId(null)
    }
  }

  const handleOpenInvoice = async (item: Product) => {
    try {
      if (!item.invoiceNumber) return
      setLoadingInvoiceId(item.orderDetailId)
      const res = await GetStatementInvoice(item.invoiceNumber!)

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
      setLoadingInvoiceId(null)
    }
  }

  const fetchReturnPickupOtp = async (item: Product) => {
    try {
      // Check if item has invoiceNumber and orderDetailId
      if (!item.invoiceId || !item.orderDetailId) return

      if (render[item.orderDetailId]) return
      setRender((prev) => ({ ...prev, [item.orderDetailId]: true }))
      // Only fetch if we haven't already fetched for this item
      if (returnPickupOtps[item.orderDetailId]) return

      const response = await orderReturnPickupOtp({
        invoiceId: item.invoiceId.toString(),
        orderDetailId: item.orderDetailId.toString()
      })

      if (response?.otp) {
        setReturnPickupOtps((prev) => ({
          ...prev,
          [item.orderDetailId]: response.otp
        }))
      }
    } catch (error) {
      console.error("Error fetching return pickup OTP:", error)
    }
  }

  // Fetch OTPs for return items when component mounts or order changes
  useEffect(() => {
    if (order?.items) {
      order.items.forEach((item) => {
        fetchReturnPickupOtp(item)
      })
    }
  }, [order])

  const formatDeliveryDate = (date?: string) => {
    if (!date) return "--"

    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
  }

  const getDaysLeftToReturn = (item: Product) => {
    const now = new Date()

    const lastReturn = item.lastReturnDate
      ? new Date(item.lastReturnDate)
      : new Date(item.deliveryDate)

    const diffMs = lastReturn.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

    return diffDays
  }
  const isDelivered = (item: Product) => item.isDelivered

  const isCancelled = (item: Product) => item.isCancelled

  const getModal = (selectedProduct: Product) => {
    switch (modalType) {
      case "rating":
        return (
          <OrderItemRating
            handleCloseModal={handleCloseModal}
            itemId={selectedProduct.itemId}
            variantId={selectedProduct.itemVariantId}
            product={selectedProduct}
          />
        )
      case "return":
        return (
          <OrderItemReturn
            handleCloseModal={handleCloseModal}
            itemId={selectedProduct.itemId}
            variantId={selectedProduct.itemVariantId}
            product={selectedProduct}
            order={order}
          />
        )
      case "cancel":
        return (
          <CancelItem
            handleCloseModal={handleCloseModal}
            item={selectedProduct}
            onConfirm={() => handleCancelOrder(selectedProduct)}
            loading={loadingCancelId === selectedProduct.orderDetailId}
          />
        )

      default:
        break
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
          <Item title="Order ID:" value={order?.custOrdNo} />
          <Item title="Placed on:" value={format(new Date(order.orderDate), "dd MMM, yyyy")} />
        </FlexBetween>

        {order?.items?.map((item, ind) => (
          <FlexBetween key={ind} px={2} py={1} flexWrap="wrap" gap={1}>
            <Link
              href={`/products/${item.itemId}${item.itemId ? `?variantId=${item.itemVariantId}` : ""}`}
            >
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

            <FlexBox gap={1.5} flexWrap="wrap" alignItems="center">
              {isDelivered(item) ? (
                <>
                  <FlexBox flexDirection="column" gap={0.2}>
                    <Typography variant="caption" color="text.secondary">
                      Delivered on {formatDeliveryDate(item.deliveryDate)}
                    </Typography>
                  </FlexBox>

                  <FlexBox gap={1} flexWrap="wrap">
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleOpenInvoice(item)}
                      disabled={loadingInvoiceId === item.orderDetailId}
                    >
                      {loadingInvoiceId === item.orderDetailId ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        "Invoice"
                      )}
                    </Button>

                    {getDaysLeftToReturn(item) > 0 && (
                      <Button
                        onClick={() => {
                          setSelectedProduct(item)
                          setModalType("return")
                        }}
                        variant="outlined"
                        size="small"
                      >
                        Return
                        <Typography
                          component="span"
                          variant="caption"
                          color="error"
                          sx={{ ml: 0.5 }}
                        >
                          ({getDaysLeftToReturn(item)} days left)
                        </Typography>
                      </Button>
                    )}

                    <Button
                      onClick={() => {
                        setSelectedProduct(item)
                        setModalType("rating")
                      }}
                      variant="text"
                      size="small"
                    >
                      Review
                    </Button>
                  </FlexBox>
                </>
              ) : isCancelled(item) ? (
                <Typography variant="body2" color="error" fontWeight={500}>
                  {item.status}
                  {item.refundAmount > 0 && (
                    <Typography variant="caption" display="block">
                      Refund: {currency(Number(item.refundAmount.toFixed(2)))}
                    </Typography>
                  )}
                </Typography>
              ) : !item.invDate ? (
                <Button
                  onClick={() => {
                    setSelectedProduct(item)
                    setModalType("cancel")
                  }}
                  variant="outlined"
                  color="error"
                  size="small"
                >
                  Cancel Item
                </Button>
              ) : (
                <FlexBox gap={1} alignItems="center" flexWrap="wrap">
                  {/* Display Return Pickup OTP if available */}
                  {returnPickupOtps[item.orderDetailId] && (
                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.75,
                        bgcolor: "warning.50",
                        border: "1.5px dashed",
                        borderColor: "warning.main",
                        borderRadius: 1.5
                      }}
                    >
                      <Typography variant="caption" color="warning.dark" fontWeight={600}>
                        Return OTP: {returnPickupOtps[item.orderDetailId]}
                      </Typography>
                    </Box>
                  )}

                  {order?.otpHash && order.otpHash.trim() !== "" && (
                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.75,
                        bgcolor: "success.50",
                        border: "1.5px dashed",
                        borderColor: "success.main",
                        borderRadius: 1.5
                      }}
                    >
                      <Typography variant="caption" color="success.dark" fontWeight={600}>
                        OTP: {order.otpHash}
                      </Typography>
                    </Box>
                  )}

                  <Chip label={item.status} size="small" color="info" sx={{ fontWeight: 500 }} />
                </FlexBox>
              )}
            </FlexBox>
          </FlexBetween>
        ))}
      </Card>

      {selectedProduct && getModal(selectedProduct)}
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
