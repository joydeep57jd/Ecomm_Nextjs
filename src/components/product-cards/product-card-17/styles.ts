"use client"

import Card from "@mui/material/Card"
import { styled } from "@mui/material/styles"

export const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "bgWhite"
})<{ bgWhite?: boolean }>(({ theme, bgWhite }) => ({
  height: "100%",
  margin: "auto",
  display: "flex",
  overflow: "hidden",
  position: "relative",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "all 250ms ease-in-out",
  backgroundColor: theme.palette.grey[50],
  ":hover": {
    ".hover-box": {
      opacity: 1,
      visibility: "visible",
      transform: "translateY(0)"
    }
  },
  ...(bgWhite && {
    backgroundColor: "white",
    border: `1px solid ${theme.palette.grey[100]}`
  })
}))

export const ImageWrapper = styled("div")(({ theme }) => ({
  height: 370,
  aspectRatio: 1,
  display: "grid",
  cursor: "pointer",
  textAlign: "center",
  position: "relative",
  placeItems: "center",
  [theme.breakpoints.down("sm")]: {
    height: "100%"
  },
  ".thumbnail": {
    gridArea: "1 / 1",
    width: "100%",
    height: "100%",
    objectFit: "cover"
  }
}))

export const HoverWrapper = styled("div")(() => ({
  zIndex: 2,
  left: 0,
  right: 0,
  bottom: 16,
  opacity: 0,
  visibility: "hidden",
  cursor: "pointer",
  position: "absolute",
  transform: "translateY(12px)",
  transition: "all 0.3s ease-in-out",
  gap: ".75rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 1rem",
  "& > *": { flex: "1 1 0", minWidth: 0, maxWidth: 150 },
  a: { display: "block" },
  ".view-btn": { backgroundColor: "white" },
  ".MuiButton-root": { whiteSpace: "nowrap" }
}))

export const ContentWrapper = styled("div")(({ theme }) => ({
  zIndex: 2,
  position: "relative",
  paddingTop: "1rem",
  textAlign: "center",
  paddingInline: "1rem",
  paddingBottom: "1.5rem",
  ".title": {
    cursor: "pointer",
    marginBottom: ".5rem",
    ":hover": {
      textDecoration: "underline"
    }
  },
  ".category": {
    fontSize: 12,
    fontWeight: 400,
    letterSpacing: 1.4,
    marginBottom: 6,
    textTransform: "uppercase",
    color: theme.palette.grey[400]
  }
}))
