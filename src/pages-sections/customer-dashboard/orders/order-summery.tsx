import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"
// GLOBAL CUSTOM COMPONENTS
import FlexBetween from "components/flex-box/flex-between"
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib"
// CUSTOM DATA MODEL
import { OrderListCustomer } from "@/models/OrderHistory.modal"

// ==============================================================
type Props = { order: OrderListCustomer };
// ==============================================================

export default function OrderSummery({ order }: Props) {

  const isRefund = order.items.some((item)=>item?.isCancelled)
  const salePrice = order.items.find((item) => item?.price !== undefined)?.price
  return (
    <Grid container spacing={3}>
      {/* <Grid size={{ md: 6, xs: 12 }}>
        <Card elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "grey.100" }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Shipping Address
          </Typography>

          <Typography variant="body1">{order.shippingAddress}</Typography>
        </Card>
      </Grid> */}

      <Grid size={{ md: 12, xs: 12 }}>
        <Card elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "grey.100" }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Total Summary
          </Typography>

          <ListItem title="Subtotal:" value={currency(+order.total)} />
          <ListItem title="Shipping fee:" value={currency(+order.delvCharge)} />
          <ListItem title="Discount:" value={currency(+order.discount)} />
          

          <Divider sx={{ mb: 1 }} />

          <FlexBetween mb={2}>
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6">{currency(+order.total)}</Typography>
          </FlexBetween>
          {isRefund ?<FlexBetween mb={2}>
            <Typography variant="h6">Refund</Typography>
            <Typography variant="h6">{currency(salePrice ?? 0)}</Typography>
          </FlexBetween>:<></>}

          {/* <p>Paid by Credit/Debit Card</p> */}
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
