"use client"

import { format } from "date-fns/format"
// MUI
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import Avatar from "@mui/material/Avatar"
import Typography from "@mui/material/Typography"
import Skeleton from "@mui/material/Skeleton"
import { styled } from "@mui/material/styles"
import CancelOutlined from "@mui/icons-material/CancelOutlined"
// CUSTOM ICON COMPONENTS
import Delivery from "icons/Delivery"
import PackageBox from "icons/PackageBox"
import TruckFilled from "icons/TruckFilled"
// CUSTOM DATA MODEL
import { OrderStatus } from "@/enums/order-status.enum"
import { OrderListCustomer, StatusTrack } from "@/models/OrderHistory.modal"

// Avatar diameter used both for sizing and for positioning the track line
// (top/left/right below must stay in sync with these).
const AVATAR_SIZE_XS = 32
const AVATAR_SIZE_SM = 44

// STYLED COMPONENTS
const StepAvatar = styled(Avatar)(({ theme }) => ({
  width: AVATAR_SIZE_XS,
  height: AVATAR_SIZE_XS,
  zIndex: 1,
  transition: "all 0.3s ease",
  "& svg": { fontSize: 16 },
  [theme.breakpoints.up("sm")]: {
    width: AVATAR_SIZE_SM,
    height: AVATAR_SIZE_SM,
    "& svg": { fontSize: 22 }
  },
  "&.completed": {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main
  },
  "&.active": {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light,
    boxShadow: `0 0 0 4px ${theme.palette.primary.light}`
  },
  "&.pending": {
    color: theme.palette.grey[400],
    backgroundColor: theme.palette.grey[100]
  }
}))

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

// Safely format a status date-time coming from the API.
const safeDateTime = (value?: string | Date | null): string | null => {
  if (!value) return null
  const date = new Date(value)
  return isNaN(date.getTime()) ? null : format(date, "dd MMM yyyy, hh:mm a")
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
                  width={AVATAR_SIZE_XS}
                  height={AVATAR_SIZE_XS}
                  sx={{ width: { sm: AVATAR_SIZE_SM }, height: { sm: AVATAR_SIZE_SM } }}
                />
                <Skeleton variant="text" width={60} />
              </Box>
            ))}
          </Box>
        </Box>
      </Card>
    )
  }

  // Prefer the status track coming from the API when available.
  if (statusTrack && statusTrack.length > 0) {
    const steps = [...statusTrack].sort((a, b) => a.stepNo - b.stepNo)

    // A step is reached (completed) once it has an actual status date/time.
    const isReached = (s: StatusTrack) => Boolean(safeDateTime(s.statusDateTime))

    // Index of the last step that has actually been reached.
    let lastReachedIndex = -1
    steps.forEach((s, i) => {
      if (isReached(s)) lastReachedIndex = i
    })

    // The current step is the flagged one, but never behind the furthest
    // reached step (a step with a timestamp is already complete).
    const flaggedIndex = steps.findIndex((s) => s.isCurrent)
    const activeIndex = Math.max(flaggedIndex, lastReachedIndex, 0)

    // Fill the line up to the furthest completed / current step.
    const progress = steps.length <= 1 ? 0 : activeIndex / (steps.length - 1)

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
        {/* STEPPER — horizontally scrollable on narrow screens so steps
            never get squeezed into overlapping each other. */}
        <Box sx={{ overflowX: { xs: "auto", sm: "visible" } }}>
          <Box
            sx={{
              position: "relative",
              display: "flex",
              justifyContent: "space-between",
              minWidth: { xs: steps.length * 60, sm: "auto" }
            }}
          >
            {/* track (behind icons) — offsets track the avatar's own
                radius so it lines up through the center of each icon at
                every breakpoint. */}
            <Box
              sx={{
                position: "absolute",
                top: { xs: AVATAR_SIZE_XS / 2 - 1, sm: AVATAR_SIZE_SM / 2 - 1 },
                left: { xs: AVATAR_SIZE_XS / 2, sm: AVATAR_SIZE_SM / 2 },
                right: { xs: AVATAR_SIZE_XS / 2, sm: AVATAR_SIZE_SM / 2 },
                height: 3,
                borderRadius: 2,
                bgcolor: "grey.100"
              }}
            />
            {/* filled track */}
            <Box
              sx={{
                position: "absolute",
                top: { xs: AVATAR_SIZE_XS / 2 - 1, sm: AVATAR_SIZE_SM / 2 - 1 },
                left: { xs: AVATAR_SIZE_XS / 2, sm: AVATAR_SIZE_SM / 2 },
                width: {
                  xs: `calc((100% - ${AVATAR_SIZE_XS}px) * ${progress})`,
                  sm: `calc((100% - ${AVATAR_SIZE_SM}px) * ${progress})`
                },
                height: 3,
                borderRadius: 2,
                bgcolor: "primary.main",
                transition: "width 0.4s ease"
              }}
            />

            {steps.map((step, ind) => {
              // A step with a timestamp is completed; the current unreached step
              // is active; everything else is still pending.
              const state = isReached(step)
                ? "completed"
                : ind === activeIndex
                  ? "active"
                  : "pending"
              const Icon = getStepIcon(step)
              const stepDate = safeDateTime(step.statusDateTime)
              return (
                <Box
                  key={step.statusId ?? ind}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.75,
                    flex: 1,
                    minWidth: { xs: 60, sm: "auto" },
                    px: 0.5
                  }}
                >
                  <StepAvatar className={state} alt={step.statusName}>
                    <Icon color="inherit" />
                  </StepAvatar>
                  <Typography
                    fontSize={{ xs: 10.5, sm: 12 }}
                    fontWeight={ind <= activeIndex ? 600 : 500}
                    color={ind <= activeIndex ? "text.primary" : "text.disabled"}
                    textAlign="center"
                  >
                    {step.statusName}
                  </Typography>
                  {stepDate && (
                    <Typography
                      fontSize={{ xs: 9, sm: 10.5 }}
                      color="text.secondary"
                      textAlign="center"
                    >
                      {stepDate}
                    </Typography>
                  )}
                </Box>
              )
            })}
          </Box>
        </Box>
      </Card>
    )
  }

  // No status track available (and not loading) — nothing to show.
  return null
}
