"use client"

import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import Divider from "@mui/material/Divider"
import Skeleton from "@mui/material/Skeleton"
import Typography from "@mui/material/Typography"
// import TextField from "@mui/material/TextField"
// import Button from "@mui/material/Button"
import FlexBetween from "components/flex-box/flex-between"
import useCart from "hooks/useCart"
import { currency } from "lib"
import { CheckoutOrderResponse } from "@/models/Order.model"
import { RemoteCart } from "@/models/CartProductItem.models"
import Image from "next/image"
import LockIcon from "@mui/icons-material/Lock"

const CARD_STYLES = {
  padding: 3,
  border: "1px solid",
  borderColor: "grey.100"
} as const

type Props = {
  checkoutOrderResponse: CheckoutOrderResponse
  deliveryCharge: number
  Product: RemoteCart[]
  totalAmount: number
  roundOff?: number
  roundingEnabled?: boolean
  loading?: boolean
}

export default function CheckoutSummary({
  checkoutOrderResponse,
  deliveryCharge,
  Product,
  totalAmount,
  roundOff = 0,
  roundingEnabled = false,
  loading = false
}: Props) {
  const { state } = useCart()

  if (!state || !state.cart.length) return null

  return (
    <Card elevation={0} sx={CARD_STYLES}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5 }}>
        Order Summary
      </Typography>

      {Product.map((item) => (
        <FlexBetween
          key={`${item.id}-${item.variantid}`}
          sx={{ mb: 2, alignItems: "center", gap: 1.5 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1, minWidth: 0 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                overflow: "hidden",
                flexShrink: 0,
                bgcolor: "grey.100",
                position: "relative"
              }}
            >
              {item.images?.[0]?.fullImagepath ? (
                <Image
                  src={item.images[0].fullImagepath}
                  alt={item.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="56px"
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Typography variant="caption" color="text.disabled">
                    IMG
                  </Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {item.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {[item.variantName, item.size || item.weight, `Qty ${item.quantity}`]
                  .filter(Boolean)
                  .join(" · ")}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body2" fontWeight={600} sx={{ flexShrink: 0 }}>
            {currency(item.price_regular * item.quantity)}
          </Typography>
        </FlexBetween>
      ))}

      <Divider sx={{ my: 2 }} />

      {/* Voucher */}
      {/* <Box sx={{ display: "flex", gap: 1, mb: 0.5 }}>
        <TextField
          size="small"
          placeholder="Voucher code"
          fullWidth
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
        />
        <Button variant="contained" color="primary" sx={{ borderRadius: 1.5, px: 2, flexShrink: 0 }}>
          Apply
        </Button>
      </Box>
      <Typography variant="caption" color="primary" sx={{ mb: 2, display: "block" }}>
        Try <strong>FRESH50</strong> or <strong>FREESHIP</strong>
      </Typography> */}

      {/* <Divider sx={{ my: 2 }} /> */}

      {/* AMOUNTS DEPEND ON THE SELECTED ADDRESS — ONLY THE VALUES SKELETON, SO THE CARD KEEPS ITS HEIGHT */}
      <ListItem
        title="Subtotal"
        value={checkoutOrderResponse?.grandtotalamt}
        loading={loading}
      />
      <ListItem
        title="Shipping"
        value={deliveryCharge || checkoutOrderResponse?.deliverychargeamt}
        loading={loading}
      />
      <ListItem title="Voucher" value={0} mb={roundingEnabled ? 0.75 : 2} loading={loading} />

      {/* TIED TO THE COMPANY ROUNDING RULE, NOT TO THE VALUE — SO THE ROW NEVER APPEARS/DISAPPEARS MID-CHECKOUT */}
      {roundingEnabled && (
        <FlexBetween mb={2}>
          <Typography variant="body2" color="text.secondary">
            Round Off
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {loading ? (
              <Skeleton variant="text" width={64} />
            ) : roundOff > 0 ? (
              `+ ${currency(roundOff)}`
            ) : roundOff < 0 ? (
              `- ${currency(Math.abs(roundOff))}`
            ) : (
              "–"
            )}
          </Typography>
        </FlexBetween>
      )}

      <Divider sx={{ mb: 2 }} />

      <FlexBetween>
        <Typography variant="h6" fontWeight={700}>
          Total
        </Typography>
        <Typography variant="h6" fontWeight={700}>
          {loading ? (
            <Skeleton variant="text" width={104} />
          ) : totalAmount ? (
            currency(totalAmount)
          ) : (
            "-"
          )}
        </Typography>
      </FlexBetween>

      <Box
        sx={{
          mt: 2.5,
          pt: 2,
          borderTop: "1px solid",
          borderColor: "grey.100",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 0.5
        }}
      >
        <LockIcon sx={{ fontSize: 14, color: "text.secondary" }} />
        <Typography variant="caption" color="text.secondary">
          Secure
        </Typography>
        <Typography variant="caption" color="text.disabled">
          ·
        </Typography>
        <Typography variant="caption" color="text.secondary">
          100% Fresh Guarantee
        </Typography>
        <Typography variant="caption" color="text.disabled">
          ·
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Easy returns
        </Typography>
      </Box>
    </Card>
  )
}

interface ListItemProps {
  mb?: number
  title: string
  value?: number
  loading?: boolean
}

function ListItem({ title, mb = 0.75, value = 0, loading = false }: ListItemProps) {
  return (
    <FlexBetween mb={mb}>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {/* SKELETON SITS INSIDE THE TYPOGRAPHY SO IT INHERITS THE SAME LINE HEIGHT */}
        {loading ? <Skeleton variant="text" width={64} /> : value ? currency(value) : "–"}
      </Typography>
    </FlexBetween>
  )
}
