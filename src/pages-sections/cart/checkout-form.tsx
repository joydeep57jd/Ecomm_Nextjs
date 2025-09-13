import Link from "next/link"
// MUI
import Card from "@mui/material/Card"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import TextField from "@mui/material/TextField"
import { FlexBox } from "components/flex-box"
import { CheckoutOrderResponse } from "@/models/Order.model"
import ListItem from "../checkout/checkout-summery/list-item"

type Props = {
  checkoutOrderDetails: CheckoutOrderResponse
  isLoading: boolean
}

export default function CheckoutForm({ checkoutOrderDetails, isLoading }: Props) {

  return (
    <Card
      elevation={0}
      sx={{
        padding: 3,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "grey.50"
      }}
    >
      {/* <FlexBetween mb={2}>
        <Typography variant="body1" fontSize={16} fontWeight={600}>
          Total:
        </Typography>

        <Typography variant="body1" fontSize={18} fontWeight={600} lineHeight={1}>
          {currency(getTotalPrice())}
        </Typography>
      </FlexBetween> */}

      {/* <Divider sx={{ mb: 2 }} />

      <FlexBox alignItems="center" columnGap={1} mb={2}>
        <Typography variant="body1" fontWeight={500}>
          Additional Comments
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: 12,
            lineHeight: 1,
            padding: "2px 6px",
            borderRadius: "3px",
            bgcolor: "grey.200"
          }}
        >
          Note
        </Typography>
      </FlexBox> */}

      {/* COMMENTS TEXT FIELD */}
      {/* <TextField variant="outlined" rows={3} fullWidth multiline /> */}

      {/* APPLY VOUCHER TEXT FIELD */}
      <FlexBox alignItems="center" gap={1} my={2}>
        <TextField
          fullWidth
          size="small"
          label="Voucher"
          variant="outlined"
          placeholder="Voucher"
        />

        <Button variant="outlined" color="primary">
          Apply
        </Button>
      </FlexBox>

      <Divider sx={{ mb: 2 }} />

      <ListItem title="Subtotal" value={checkoutOrderDetails?.totalamt} />
      <ListItem title="Shipping" value={0} />
      <ListItem title="Tax" value={checkoutOrderDetails?.totaltaxamt} />
      <ListItem title="Discount" value={0} />


      <Divider sx={{ mb: 2 }} />

      <ListItem title="Total" value={checkoutOrderDetails?.grandtotalamt} />

      <Button fullWidth color="primary" href="/checkout-alternative" loading={isLoading} variant="contained" LinkComponent={Link} sx={{ mt: 2 }}>
        Checkout Now
      </Button>
    </Card>
  )
}
