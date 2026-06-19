"use client"

import Card from "@mui/material/Card"
import { styled } from "@mui/material/styles"

export const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "bgWhite"
})<{ bgWhite?: boolean }>(({ theme }) => ({
  height: "100%",
  margin: "auto",
  marginTop: 5,
  display: "flex",
  overflow: "hidden",
  position: "relative",
  flexDirection: "column",
  borderRadius: 16,
  backgroundColor: "#fff",

  border: `1px solid ${theme.palette.grey[200]}`
}))

export const ImageWrapper = styled("div")(({ theme }) => ({
  width: "100%",
  aspectRatio: "5 / 6",
  overflow: "hidden",
  position: "relative",
  background: "#fff",
  // The Link wrapping the image is inline by default, which collapses the
  // image's height; force it to fill the frame.
  "& > a": {
    display: "block",
    width: "100%",
    height: "100%"
  },
  ".thumbnail": {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    objectPosition: "center",
    padding: "8px",
    "&:hover": {
      transform: "scale(1.04)"
    },
    transition: "transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)"
  },
  ".stock-overlay": {
    zIndex: 3,
    inset: 0,
    position: "absolute",
    display: "grid",
    placeItems: "center",
    background: "rgba(255, 255, 255, 0.45)"
  },
  ".stock-overlay span": {
    fontSize: 12,
    fontWeight: 700,
    borderRadius: 999,
    padding: "5px 14px",
    color: theme.palette.common.white,
    backgroundColor: theme.palette.grey[700]
  }
}))

export const ContentWrapper = styled("div")(({ theme }) => ({
  flex: 1,
  gap: 4,
  display: "flex",
  padding: "0.85rem",
  flexDirection: "column",
  ".brand": {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: theme.palette.grey[500]
  },
  ".title": {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    minHeight: "2.5rem",
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.3,
    color: theme.palette.text.primary,
    transition: "color 150ms ease-in-out",
    ":hover": { color: theme.palette.primary.main }
  },
  ".rating-row": {
    minHeight: 20
  },
  ".review-count": {
    fontSize: 12,
    color: theme.palette.grey[500]
  },
  ".rating-pill": {
    width: "fit-content",
    display: "inline-flex",
    alignItems: "center",
    gap: 2,
    borderRadius: 4,
    padding: "1px 6px",
    fontSize: 12,
    fontWeight: 600,
    color: "#fff",
    backgroundColor: theme.palette.success.dark
  },
  ".footer": {
    gap: 8,
    marginTop: "auto",
    paddingTop: 6,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between"
  },
  ".price": {
    fontSize: 14,
    fontWeight: 700,
    color: theme.palette.text.primary
  },
  ".mrp": {
    fontSize: 12,
    color: theme.palette.grey[500],
    textDecoration: "line-through"
  },
  ".save": {
    fontSize: 11,
    fontWeight: 600,
    color: theme.palette.success.dark
  },
  ".stock-label": {
    fontSize: 12,
    fontWeight: 700,
    borderRadius: 999,
    padding: "5px 12px",
    whiteSpace: "nowrap",
    color: theme.palette.error.main,
    backgroundColor: theme.palette.error.light
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
