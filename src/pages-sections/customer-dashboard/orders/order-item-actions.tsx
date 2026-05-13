"use client"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import CircularProgress from "@mui/material/CircularProgress"
import { FlexBox } from "components/flex-box"
import { currency } from "lib"
import { Item as Product, OrderListCustomer } from "@/models/OrderHistory.modal"
import OrderItemOtp from "./order-item-otp"

interface Props {
  item: Product
  order: OrderListCustomer
  loadingInvoiceId: number | null
  returnOtp?: string
  orderOtp?: string
  getDaysLeftToReturn: (item: Product) => number
  formatDeliveryDate: (date?: string) => string
  onInvoice: (item: Product) => void
  onReturn: (item: Product) => void
  onRating: (item: Product) => void
  onCancel: (item: Product) => void
}

export default function OrderItemActions({
  item,
  loadingInvoiceId,
  returnOtp,
  orderOtp,
  getDaysLeftToReturn,
  formatDeliveryDate,
  onInvoice,
  onReturn,
  onRating,
  onCancel
}: Props) {
  if (item.isDelivered) {
    return (
      <FlexBox gap={1.5} flexWrap="wrap" alignItems="center">
        <FlexBox flexDirection="column" gap={0.2}>
          <Typography variant="caption" color="text.secondary">
            Delivered on {formatDeliveryDate(item.deliveryDate)}
          </Typography>
        </FlexBox>

        <FlexBox gap={1} flexWrap="wrap">
          <Button
            variant="contained"
            size="small"
            onClick={() => onInvoice(item)}
            disabled={loadingInvoiceId === item.orderDetailId}
          >
            {loadingInvoiceId === item.orderDetailId ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              "Invoice"
            )}
          </Button>

          {getDaysLeftToReturn(item) > 0 && (
            <Button onClick={() => onReturn(item)} variant="outlined" size="small">
              Return
              <Typography component="span" variant="caption" color="error" sx={{ ml: 0.5 }}>
                ({getDaysLeftToReturn(item)} days left)
              </Typography>
            </Button>
          )}

          <Button onClick={() => onRating(item)} variant="text" size="small">
            Review
          </Button>
        </FlexBox>
      </FlexBox>
    )
  }

  if (item.isCancelled) {
    return (
      <Typography variant="body2" color="error" fontWeight={500}>
        {item.status}
        {item.refundAmount > 0 && (
          <Typography variant="caption" display="block">
            Refund: {currency(Number(item.refundAmount.toFixed(2)))}
          </Typography>
        )}
      </Typography>
    )
  }

  if (!item.invDate) {
    return (
      <Button onClick={() => onCancel(item)} variant="outlined" color="error" size="small">
        Cancel Item
      </Button>
    )
  }

  return (
    <FlexBox gap={1.5} flexWrap="wrap" alignItems="center">
      <OrderItemOtp returnOtp={returnOtp} orderOtp={orderOtp} />
      <Chip label={item.status} size="small" color="info" sx={{ fontWeight: 500 }} />
    </FlexBox>
  )
}
