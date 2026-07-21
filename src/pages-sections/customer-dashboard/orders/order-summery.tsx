import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"
// GLOBAL CUSTOM COMPONENTS
import FlexBetween from "components/flex-box/flex-between"
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib"
// CUSTOM DATA MODEL
import {
  DeliveryAddress,
  GetOrderPaymentAndAddressResponse,
  OrderListCustomer
} from "@/models/OrderHistory.modal"

// ==============================================================
type Props = {
  order: OrderListCustomer
  paymentAndAddress: GetOrderPaymentAndAddressResponse | null
}
// ==============================================================

const formatAddress = (address: DeliveryAddress): string =>
  [address.addressLine1, address.addressLine2, address.city, address.district, address.state]
    .filter(Boolean)
    .join(", ")

export default function OrderSummery({ order, paymentAndAddress }: Props) {
  const address = paymentAndAddress?.deliveryAddress

  return (
    <Grid container spacing={3}>
      <Grid size={{ md: 6, xs: 12 }}>
        <Card elevation={0} sx={{ p: { xs: 2, sm: 3 }, border: "1px solid", borderColor: "grey.100", height: "100%" }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Shipping Address
          </Typography>

          {address ? (
            <>
              {paymentAndAddress?.customerName && (
                <Typography variant="body1" fontWeight={600}>
                  {paymentAndAddress.customerName}
                </Typography>
              )}

              <Typography variant="body1" color="text.secondary">
                {formatAddress(address)}
              </Typography>

              {address.pin && (
                <Typography variant="body1" color="text.secondary">
                  PIN: {address.pin}
                </Typography>
              )}

              {(address.phone || paymentAndAddress?.customerPhone) && (
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  Phone: {address.phone || paymentAndAddress?.customerPhone}
                </Typography>
              )}

              {(address.email || paymentAndAddress?.customerEmail) && (
                <Typography variant="body1" color="text.secondary">
                  Email: {address.email || paymentAndAddress?.customerEmail}
                </Typography>
              )}
            </>
          ) : (
            <Typography variant="body1" color="text.secondary">
              Address not available
            </Typography>
          )}
        </Card>
      </Grid>

      <Grid size={{ md: 6, xs: 12 }}>
        <Card elevation={0} sx={{ p: { xs: 2, sm: 3 }, border: "1px solid", borderColor: "grey.100", height: "100%" }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Total Summary
          </Typography>

          <ListItem title="Subtotal:" value={currency(+order.subTotal)} />
          <ListItem title="Tax:" value={currency(+order.tax)} />
          <ListItem title="Shipping fee:" value={currency(+order.delvCharge)} />
          <ListItem title="Discount:" value={currency(+order.discount)} />
          <ListItem title="Round Off:" value={currency(+order.roundOff)} />

          <Divider sx={{ mb: 1 }} />

          <FlexBetween mb={2}>
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6">{currency(+order.total)}</Typography>
          </FlexBetween>

          {paymentAndAddress?.paymentMode && (
            <>
              <Divider sx={{ mb: 1 }} />
              <FlexBetween>
                <Typography color="text.secondary" variant="body1">
                  Payment Method:
                </Typography>
                <Typography variant="h6">{paymentAndAddress.paymentMode}</Typography>
              </FlexBetween>
            </>
          )}
        </Card>
      </Grid>
    </Grid>
  )
}

function ListItem({ title, value }: { title: string; value: string }) {
  return (
    <FlexBetween mb={1}>
      <Typography color="text.secondary" variant="body1">
        {title}
      </Typography>

      <Typography variant="h6">{value}</Typography>
    </FlexBetween>
  )
}
