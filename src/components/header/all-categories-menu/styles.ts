"use client"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import { styled } from "@mui/material/styles"

export const MenuRoot = styled(Box)({
  position: "relative",
  "&:hover .all-categories-panel": {
    opacity: 1,
    visibility: "visible",
    transform: "translateY(0)"
  }
})

export const TriggerButton = styled(Button)(({ theme }) => ({
  gap: 6,
  flexShrink: 0,
  fontWeight: 600,
  borderRadius: 8,
  textTransform: "none",
  paddingInline: "0.4rem",
  paddingBlock: "0.4rem",
  backgroundColor: "transparent",
  color: theme.palette.orange.main,
  ":hover": {
    backgroundColor: "transparent",
    color: theme.palette.orange.dark
  },
  ".dropdown-icon": {
    transition: "transform 200ms ease-in-out"
  }
}))

export const Panel = styled("div")(({ theme }) => ({
  zIndex: 50,
  top: "100%",
  left: 0,
  marginTop: 8,
  position: "absolute",
  borderRadius: 12,
  padding: "1rem",
  display: "grid",
  gap: "0.75rem",
  width: "min(680px, 90vw)",
  gridTemplateColumns: "repeat(3, 1fr)",
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[8],
  border: `1px solid ${theme.palette.grey[200]}`,
  opacity: 0,
  visibility: "hidden",
  transform: "translateY(-6px)",
  transition: "opacity 150ms ease-in-out, transform 150ms ease-in-out, visibility 150ms"
}))

export const ColumnBox = styled("div")(({ theme }) => ({
  borderRadius: 10,
  padding: "0.85rem",
  ".col-title": {
    fontWeight: 700,
    fontSize: 14,
    marginBottom: 6,
    display: "block",
    textDecoration: "none"
  },
  ".sub-link": {
    display: "block",
    fontSize: 13,
    padding: "3px 0",
    color: theme.palette.text.secondary,
    textDecoration: "none",
    ":hover": {
      color: theme.palette.text.primary
    }
  }
}))
