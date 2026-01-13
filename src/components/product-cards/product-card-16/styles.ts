"use client"

import { styled } from "@mui/material/styles"

/* =======================
   PRODUCT CARD ROOT
======================= */
export const StyledRoot = styled("div")(({ theme }) => ({
  height: "100%", // 🔑 equal height for grid items
  display: "flex",
  flexDirection: "column",
  borderRadius: 12,
  overflow: "hidden",
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  transition: "transform .2s ease, box-shadow .2s ease",

  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[3]
  },

  /* =======================
     IMAGE WRAPPER
  ======================= */
  "& .img-wrapper": {
    position: "relative",
    backgroundColor: theme.palette.grey[50],
    aspectRatio: "1 / 1", // 🔑 same image size everywhere
    overflow: "hidden",

    img: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      transition: "transform .3s ease"
    }
  },

  "&:hover .img-wrapper img": {
    transform: "scale(1.08)"
  },

  /* =======================
     CONTENT SECTION
  ======================= */
  "& .content": {
    flexGrow: 1,
    display: "flex",
    padding: theme.spacing(1),

    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(1.5)
    },

    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(2)
    }
  },

  "& .content-inner": {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between" // 🔑 price stays aligned
  },

  /* =======================
     TITLE + UNIT
  ======================= */
  "& .title-row": {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing(1)
  },

  "& .title": {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",

    [theme.breakpoints.up("md")]: {}
  },

  "& .unit-badge": {
    marginTop: theme.spacing(0.5),
    fontSize: 11,
    padding: "2px 6px",
    borderRadius: 6,
    whiteSpace: "nowrap",
    height: "fit-content",
    textTransform: "uppercase",
  },

  /* =======================
     VARIANT CHIPS
  ======================= */
  "& .variant-row": {
    display: "flex",
    gap: theme.spacing(0.5),
    flexWrap: "wrap",
    marginTop: theme.spacing(0.5)
  }
}))

/* =======================
   PRICE TEXT
======================= */
export const PriceText = styled("p")(({ theme }) => ({
  marginTop: theme.spacing(1),
  fontWeight: 600,
  lineHeight: 1,
  color: theme.palette.primary.main,
  fontSize: 13,

  [theme.breakpoints.up("md")]: {
    fontSize: 14
  },

  ".base-price": {
    marginLeft: 6,
    fontSize: 11,
    color: theme.palette.grey[500],
    textDecoration: "line-through",

    [theme.breakpoints.up("md")]: {
      fontSize: 13
    }
  }
}))
