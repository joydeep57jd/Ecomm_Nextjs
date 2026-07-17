"use client"

import { ReactNode } from "react"
import { format } from "date-fns/format"
// MUI
import Box from "@mui/material/Box"
import Avatar from "@mui/material/Avatar"
import Typography from "@mui/material/Typography"
import { styled } from "@mui/material/styles"

export type StepSize = "small" | "medium"
export type StepState = "completed" | "active" | "pending"

// Avatar diameter used both for sizing and for positioning the track line.
export const STEP_AVATAR_SIZE: Record<StepSize, { xs: number; sm: number }> = {
  medium: { xs: 32, sm: 44 },
  small: { xs: 24, sm: 30 }
}

// STYLED COMPONENTS
const StepAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== "stepSize"
})<{ stepSize: StepSize }>(({ theme, stepSize }) => ({
  width: STEP_AVATAR_SIZE[stepSize].xs,
  height: STEP_AVATAR_SIZE[stepSize].xs,
  fontSize: stepSize === "small" ? 11 : 13,
  fontWeight: 600,
  zIndex: 1,
  transition: "all 0.3s ease",
  "& svg": { fontSize: stepSize === "small" ? 13 : 16 },
  [theme.breakpoints.up("sm")]: {
    width: STEP_AVATAR_SIZE[stepSize].sm,
    height: STEP_AVATAR_SIZE[stepSize].sm,
    "& svg": { fontSize: stepSize === "small" ? 16 : 22 }
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
export interface StepperStep {
  stepNo: number
  statusName: string
  statusDateTime?: Date | string | null
  isCurrent?: boolean
}

interface Props<T extends StepperStep> {
  steps: T[]
  size?: StepSize
  // Content shown inside a step's avatar. Defaults to the step's position.
  renderIcon?: (step: T, index: number, state: StepState) => ReactNode
}
// ==============================================================

// Safely format a status date-time coming from the API.
export const safeDateTime = (value?: string | Date | null): string | null => {
  if (!value) return null
  const date = new Date(value)
  return isNaN(date.getTime()) ? null : format(date, "dd MMM yyyy, hh:mm a")
}

// A step is reached (completed) once it has an actual status date/time.
const isReached = (step: StepperStep) => Boolean(safeDateTime(step.statusDateTime))

export default function StatusStepper<T extends StepperStep>({
  steps: unsortedSteps,
  size = "medium",
  renderIcon
}: Props<T>) {
  const steps = [...unsortedSteps].sort((a, b) => a.stepNo - b.stepNo)
  const avatar = STEP_AVATAR_SIZE[size]

  // Index of the last step that has actually been reached.
  let lastReachedIndex = -1
  steps.forEach((step, i) => {
    if (isReached(step)) lastReachedIndex = i
  })

  // The current step is the flagged one, but never behind the furthest reached
  // step (a step with a timestamp is already complete).
  const flaggedIndex = steps.findIndex((step) => step.isCurrent)
  const activeIndex = Math.max(flaggedIndex, lastReachedIndex, 0)

  // Fill the line up to the furthest completed / current step.
  const progress = steps.length <= 1 ? 0 : activeIndex / (steps.length - 1)

  return (
    // STEPPER — horizontally scrollable on narrow screens so steps never get
    // squeezed into overlapping each other.
    <Box sx={{ overflowX: { xs: "auto", sm: "visible" } }}>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          minWidth: { xs: steps.length * 60, sm: "auto" }
        }}
      >
        {/* track (behind icons) — offsets track the avatar's own radius so it
            lines up through the center of each icon at every breakpoint. */}
        <Box
          sx={{
            position: "absolute",
            top: { xs: avatar.xs / 2 - 1, sm: avatar.sm / 2 - 1 },
            left: { xs: avatar.xs / 2, sm: avatar.sm / 2 },
            right: { xs: avatar.xs / 2, sm: avatar.sm / 2 },
            height: 3,
            borderRadius: 2,
            bgcolor: "grey.100"
          }}
        />
        {/* filled track */}
        <Box
          sx={{
            position: "absolute",
            top: { xs: avatar.xs / 2 - 1, sm: avatar.sm / 2 - 1 },
            left: { xs: avatar.xs / 2, sm: avatar.sm / 2 },
            width: {
              xs: `calc((100% - ${avatar.xs}px) * ${progress})`,
              sm: `calc((100% - ${avatar.sm}px) * ${progress})`
            },
            height: 3,
            borderRadius: 2,
            bgcolor: "primary.main",
            transition: "width 0.4s ease"
          }}
        />

        {steps.map((step, ind) => {
          // A step with a timestamp is completed; the current unreached step is
          // active; everything else is still pending.
          const state: StepState = isReached(step)
            ? "completed"
            : ind === activeIndex
              ? "active"
              : "pending"
          const stepDate = safeDateTime(step.statusDateTime)

          return (
            <Box
              key={step.stepNo ?? ind}
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
              <StepAvatar className={state} stepSize={size} alt={step.statusName}>
                {renderIcon ? renderIcon(step, ind, state) : ind + 1}
              </StepAvatar>

              <Typography
                fontSize={size === "small" ? { xs: 10, sm: 11 } : { xs: 10.5, sm: 12 }}
                fontWeight={ind <= activeIndex ? 600 : 500}
                color={ind <= activeIndex ? "text.primary" : "text.disabled"}
                textAlign="center"
              >
                {step.statusName}
              </Typography>

              {stepDate && (
                <Typography fontSize={{ xs: 9, sm: 10.5 }} color="text.secondary" textAlign="center">
                  {stepDate}
                </Typography>
              )}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
