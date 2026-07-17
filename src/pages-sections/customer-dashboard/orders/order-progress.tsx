"use client"

import { format } from "date-fns/format"
// MUI
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import Typography from "@mui/material/Typography"
import Skeleton from "@mui/material/Skeleton"
import CancelOutlined from "@mui/icons-material/CancelOutlined"
// CUSTOM ICON COMPONENTS
import Delivery from "icons/Delivery"
import PackageBox from "icons/PackageBox"
import TruckFilled from "icons/TruckFilled"
// LOCAL CUSTOM COMPONENTS
import StatusStepper, { STEP_AVATAR_SIZE } from "./status-stepper"
// CUSTOM DATA MODEL
import { OrderStatus } from "@/enums/order-status.enum"
import { OrderListCustomer, StatusTrack } from "@/models/OrderHistory.modal"

// ==============================================================
interface Props {
  order: OrderListCustomer
  statusTrack?: StatusTrack[]
  statusLoading?: boolean
}
// ==============================================================

// Pick an icon for a step based on its API statusId.
//   8 -> truck (out for delivery)
//   9 -> delivery
//   anything else -> package box
const getStepIcon = (step: StatusTrack) => {
  if (step.statusId === 8) return TruckFilled
  if (step.statusId === 9) return Delivery
  return PackageBox
}

// Safely format a date that may be null / empty / invalid.
const safeDate = (value?: string | Date | null): string | null => {
  if (!value) return null
  const date = new Date(value)
  return isNaN(date.getTime()) ? null : format(date, "dd MMM yyyy")
}

export default function OrderProgress({ order, statusTrack, statusLoading }: Props) {
  const isCancelled = order.isCancel || order.orderStatus === OrderStatus.CANCELLED

  if (isCancelled) {
    const cancelledOn = safeDate(order.cancelDate)
    return (
      <Card
        elevation={0}
        sx={{
          mb: 3,
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          border: "1px solid",
          borderColor: "error.200",
          borderRadius: 2,
          bgcolor: "error.light"
        }}
      >
        <CancelOutlined sx={{ color: "error.main" }} />
        <Box>
          <Typography fontWeight={600} fontSize={14} color="error.main">
            Order Cancelled
          </Typography>
          {cancelledOn && (
            <Typography fontSize={12} color="text.secondary">
              on {cancelledOn}
            </Typography>
          )}
        </Box>
      </Card>
    )
  }

  // While the status track is still being fetched, show a skeleton instead of
  // the fallback stepper so the real steps don't flash in afterwards.
  if (statusLoading && (!statusTrack || statusTrack.length === 0)) {
    return (
      <Card
        elevation={0}
        sx={{
          mb: 3,
          p: { xs: 2, sm: 2.5 },
          border: "1px solid",
          borderColor: "grey.100",
          borderRadius: 2
        }}
      >
        <Box sx={{ overflowX: { xs: "auto", sm: "visible" } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              minWidth: { xs: 3 * 60, sm: "auto" }
            }}
          >
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.75,
                  flex: 1,
                  minWidth: { xs: 60, sm: "auto" }
                }}
              >
                <Skeleton
                  variant="circular"
                  width={STEP_AVATAR_SIZE.medium.xs}
                  height={STEP_AVATAR_SIZE.medium.xs}
                  sx={{
                    width: { sm: STEP_AVATAR_SIZE.medium.sm },
                    height: { sm: STEP_AVATAR_SIZE.medium.sm }
                  }}
                />
                <Skeleton variant="text" width={60} />
              </Box>
            ))}
          </Box>
        </Box>
      </Card>
    )
  }

  // No status track available (and not loading) — nothing to show.
  if (!statusTrack || statusTrack.length === 0) return null

  return (
    <Card
      elevation={0}
      sx={{
        mb: 3,
        p: { xs: 2, sm: 2.5 },
        border: "1px solid",
        borderColor: "grey.100",
        borderRadius: 2
      }}
    >
      <StatusStepper
        steps={statusTrack}
        renderIcon={(step) => {
          const Icon = getStepIcon(step)
          return <Icon color="inherit" />
        }}
      />
    </Card>
  )
}
