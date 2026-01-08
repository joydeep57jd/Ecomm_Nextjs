"use client"

// MUI
import Card from "@mui/material/Card"
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"
// GLOBAL CUSTOM COMPONENTS
import FlexBetween from "components/flex-box/flex-between"
// GLOBAL CUSTOM HOOK
import useCart from "hooks/useCart"
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib"
import { CheckoutOrderResponse } from "@/models/Order.model"
import { RemoteCart } from "@/models/CartProductItem.models"

const CARD_STYLES = {
  padding: 3,
  border: "1px solid",
  borderColor: "grey.100"
} as const

type Props = {
  checkoutOrderResponse: CheckoutOrderResponse
  deliveryCharge: number
  Product:RemoteCart[]
}

export default function CheckoutSummary({ checkoutOrderResponse,  Product }: Props) {
  const { state } = useCart()


  if (!state || !state.cart.length) return null

  return (
    <Card elevation={0} sx={CARD_STYLES}>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Your order
      </Typography>

      {Product.map((item) => (
        <FlexBetween mb={1.5} key={`${item.id}-${item.variantid}`}>
          <Typography variant="body1">
            <strong>{item.quantity}</strong> x {item.name}
          </Typography>

          <Typography variant="body1">{currency(item.price_regular * item.quantity)}</Typography>
        </FlexBetween>
      ))}

      <Divider sx={{ my: 3 }} />

      <ListItem title="Subtotal" value={checkoutOrderResponse?.totalamt} />
      <ListItem title="Shipping" value={checkoutOrderResponse?.deliverychargeamt} />
      {/* <ListItem title="Tax" value={checkoutOrderResponse?.totaltaxamt} /> */}
      <ListItem title="Voucher" value={0} mb={3} />

      <Divider sx={{ mb: 1 }} />

      <ListItem title="Total" value={(checkoutOrderResponse?.grandtotalamt)} />
    </Card>
  )
}

interface ListItemProps {
  mb?: number;
  title: string;
  value?: number;
}

function ListItem({ title, mb = 0.5, value = 0 }: ListItemProps) {
  return (
    <FlexBetween mb={mb}>
      <Typography variant="body1" color="text.secondary">
        {title}:
      </Typography>

      <Typography variant="body1" fontWeight={600}>
        {value ? currency(value) : "-"}
      </Typography>
    </FlexBetween>
  )
}
