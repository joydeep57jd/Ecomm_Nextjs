"use client"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import Card from "@mui/material/Card"
import Avatar from "@mui/material/Avatar"
import Typography from "@mui/material/Typography"
import { FlexBetween, FlexBox } from "components/flex-box"
import { currency } from "lib"
import { OrderListCustomer, Item as Product } from "@/models/OrderHistory.modal"
import { useState, useEffect } from "react"
import { useUser } from "@/contexts/UserContenxt"
import { customerCancelRequest, GetStatementInvoice, orderReturnPickupOtp } from "@/utils/api/order"
import { CustCancelRequest } from "@/models/Order.model"
import OrderItemRating from "./page-view/order-item-rating"
import OrderItemReturn from "./page-view/order-item-return"
import CancelItem from "./page-view/cancel-item"
import OrderItemActions from "./order-item-actions"
import { encodeId } from "@/utils/url-id"

type Props = { order: OrderListCustomer; refreshOrder: () => void }

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
      const newWindow = window.open("", "_blank")
      if (newWindow) {
        newWindow.document.write(res.html)
        newWindow.document.title = `Invoice - ${order.custOrdNo}`
        newWindow.document.close()
      }
    } catch (error) {
      console.error("Error fetching invoice:", error)
    } finally {
      setLoadingInvoiceId(null)
    }
  }

  const fetchReturnPickupOtp = async (item: Product) => {
    try {
      if (!item.invoiceId || !item.orderDetailId) return
      if (render[item.orderDetailId]) return
      setRender((prev) => ({ ...prev, [item.orderDetailId]: true }))
      if (returnPickupOtps[item.orderDetailId]) return
      const response = await orderReturnPickupOtp({
        invoiceId: item.invoiceId.toString(),
        orderDetailId: item.orderDetailId.toString()
      })
      if (response?.otp) {
        setReturnPickupOtps((prev) => ({ ...prev, [item.orderDetailId]: response.otp }))
      }
    } catch (error) {
      console.error("Error fetching return pickup OTP:", error)
    }
  }

  useEffect(() => {
    if (order?.items) order.items.forEach(fetchReturnPickupOtp)
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
    return Math.ceil((lastReturn.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getModal = (product: Product) => {
    switch (modalType) {
      case "rating":
        return (
          <OrderItemRating
            handleCloseModal={handleCloseModal}
            itemId={product.itemId}
            variantId={product.itemVariantId}
            product={product}
          />
        )
      case "return":
        return (
          <OrderItemReturn
            handleCloseModal={handleCloseModal}
            itemId={product.itemId}
            variantId={product.itemVariantId}
            product={product}
            order={order}
          />
        )
      case "cancel":
        return (
          <CancelItem
            handleCloseModal={handleCloseModal}
            item={product}
            onConfirm={() => handleCancelOrder(product)}
            loading={loadingCancelId === product.orderDetailId}
          />
        )
      default:
        return null
    }
  }

  const shownOtps = new Set<string>()

  return (
    <>
      <Card elevation={0} sx={{ p: 0, mb: 4, border: "1px solid", borderColor: "grey.100" }}>
        <FlexBetween px={3} py={2} flexWrap="wrap" gap={1} bgcolor="grey.50">
          <Item title="Order ID:" value={order?.custOrdNo} />
          <Item title="Placed on:" value={format(new Date(order.orderDate), "dd MMM, yyyy")} />
        </FlexBetween>

        {order?.items?.map((item, ind) => {
          const otp = returnPickupOtps[item.orderDetailId]
          const orderOtp = order?.otpHash?.trim()
          const showReturnOtp = otp && !shownOtps.has(otp) ? otp : undefined
          const showOrderOtp = orderOtp && !shownOtps.has(orderOtp) ? orderOtp : undefined
          if (showReturnOtp) shownOtps.add(otp)
          if (showOrderOtp) shownOtps.add(orderOtp)

          return (
            <FlexBetween key={ind} px={2} py={1} flexWrap="wrap" gap={1}>
              <Link
                href={`/products/${encodeId(item.itemId)}${item.itemId ? `?variantId=${encodeId(item.itemVariantId)}` : ""}`}
              >
                <FlexBox gap={2} alignItems="center">
                  <Avatar
                    variant="rounded"
                    sx={{ height: 60, width: 60, backgroundColor: "grey.50" }}
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

              <OrderItemActions
                item={item}
                order={order}
                loadingInvoiceId={loadingInvoiceId}
                returnOtp={showReturnOtp}
                orderOtp={showOrderOtp}
                getDaysLeftToReturn={getDaysLeftToReturn}
                formatDeliveryDate={formatDeliveryDate}
                onInvoice={handleOpenInvoice}
                onReturn={(i) => {
                  setSelectedProduct(i)
                  setModalType("return")
                }}
                onRating={(i) => {
                  setSelectedProduct(i)
                  setModalType("rating")
                }}
                onCancel={(i) => {
                  setSelectedProduct(i)
                  setModalType("cancel")
                }}
              />
            </FlexBetween>
          )
        })}
      </Card>

      {selectedProduct && getModal(selectedProduct)}
    </>
  )
}

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
