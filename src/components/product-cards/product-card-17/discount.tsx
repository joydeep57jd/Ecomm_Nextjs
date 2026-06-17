"use client"

import Chip, { ChipProps } from "@mui/material/Chip"
import { styled } from "@mui/material/styles"

// STYLED COMPONENT
const StyledChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "shape"
})<{ shape: "rounded" | "square" }>(({ shape, theme }) => ({
  zIndex: 2,
  top: 10,
  left: 10,
  height: 22,
  fontSize: 11,
  fontWeight: 700,
  borderRadius: 6,
  position: "absolute",
  color: theme.palette.common.white,
  backgroundColor: theme.palette.orange.main,
  boxShadow: theme.shadows[1],
  "& .MuiChip-label": { paddingInline: 8 },
  ...(shape === "square" && { borderRadius: 0 })
}))

// ==============================================================
interface Props extends ChipProps {
  discount: number
  shape?: "rounded" | "square"
}
// ==============================================================

export default function Discount({ discount = 0, shape = "rounded", ...props }: Props) {
  if (discount > 0) {
    return <StyledChip size="small" shape={shape} label={`${discount}% OFF`} {...props} />
  }

  return null
}
