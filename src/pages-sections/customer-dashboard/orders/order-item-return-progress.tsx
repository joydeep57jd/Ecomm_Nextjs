"use client"

import { useEffect, useState } from "react"
// MUI
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import CheckRounded from "@mui/icons-material/CheckRounded"
// LOCAL CUSTOM COMPONENTS
import StatusStepper from "./status-stepper"
// API
import { getReturnOrderTruck } from "@/utils/api/order"
// CUSTOM DATA MODEL
import { ReturnOrderTruckResponse } from "@/models/Order.model"

// ==============================================================
interface Props {
  orderDetailId: number
}
// ==============================================================

// Return status track for a single ordered item. The API is asked per item and
// only answers with steps for items that actually have a return in progress —
// so an empty response means this item renders nothing at all.
export default function OrderItemReturnProgress({ orderDetailId }: Props) {
  const [steps, setSteps] = useState<ReturnOrderTruckResponse[]>([])

  useEffect(() => {
    if (!orderDetailId) return
    let ignore = false

    const fetchReturnTrack = async () => {
      try {
        const response = await getReturnOrderTruck(orderDetailId)
        if (!ignore) setSteps(Array.isArray(response) ? response : [])
      } catch (error) {
        console.error("Error fetching return status track:", error)
        if (!ignore) setSteps([])
      }
    }

    fetchReturnTrack()
    return () => {
      ignore = true
    }
  }, [orderDetailId])

  if (steps.length === 0) return null

  return (
    <Box
      sx={{
        mt: 1,
        px: { xs: 1.5, sm: 2 },
        py: 1.5,
        border: "1px solid",
        borderColor: "grey.100",
        borderRadius: 2,
        bgcolor: "grey.50"
      }}
    >
      <Typography
        variant="caption"
        fontWeight={600}
        color="text.secondary"
        sx={{ display: "block", mb: 1.5, letterSpacing: 0.5 }}
      >
        RETURN STATUS
      </Typography>

      <StatusStepper
        steps={steps}
        size="small"
        renderIcon={(step, ind, state) =>
          state === "completed" ? <CheckRounded color="inherit" /> : ind + 1
        }
      />
    </Box>
  )
}
