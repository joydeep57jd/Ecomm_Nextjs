"use client"

import { styled } from "@mui/material/styles"

export const CategoryGrid = styled("div")(({ theme }) => ({
  display: "grid",
  gap: "0.85rem",
  marginTop: "1rem",
  gridTemplateColumns: "repeat(3, 1fr)",
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "repeat(2, 1fr)"
  },
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr"
  }
}))

// ==============================================================
interface CardProps {
  bg: string
  color: string
  accent: string
}
// ==============================================================

export const CategoryCard = styled("div", {
  shouldForwardProp: (prop) => !["bg", "color", "accent"].includes(prop as string)
})<CardProps>(({ theme, bg, color, accent }) => ({
  position: "relative",
  overflow: "hidden",
  borderRadius: 16,
  padding: "1.25rem",
  background: bg,
  border: `1px solid ${theme.palette.grey[200]}`,
  transition: "transform 220ms ease-in-out, box-shadow 220ms ease-in-out",
  ":hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8]
  },
  ":hover .arrow": {
    transform: "translateX(4px)"
  },
  ".accent-circle": {
    pointerEvents: "none",
    position: "absolute",
    top: -24,
    right: -24,
    width: 96,
    height: 96,
    borderRadius: "50%",
    opacity: 0.2,
    background: accent
  },
  ".card-head": {
    position: "relative",
    display: "block",
    textDecoration: "none"
  },
  ".head-row": {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between"
  },
  ".icon-square": {
    display: "grid",
    placeItems: "center",
    width: 48,
    height: 48,
    borderRadius: 12,
    overflow: "hidden",
    background: accent,
    boxShadow: theme.shadows[1]
  },
  ".arrow": {
    color,
    fontSize: 20,
    transition: "transform 220ms ease-in-out"
  },
  ".card-title": {
    margin: "12px 0 2px",
    fontWeight: 700,
    fontSize: 18,
    color
  },
  ".tagline": {
    margin: 0,
    fontSize: 13,
    color: theme.palette.grey[600]
  },
  ".pills": {
    position: "relative",
    marginTop: 12,
    display: "flex",
    flexWrap: "wrap",
    gap: 6
  },
  ".pill": {
    borderRadius: 999,
    padding: "4px 10px",
    fontSize: 12,
    fontWeight: 500,
    textDecoration: "none",
    color: theme.palette.grey[700],
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    transition: "background-color 150ms ease-in-out, color 150ms ease-in-out",
    ":hover": {
      color,
      backgroundColor: "#fff"
    }
  }
}))
