"use client"

import { styled } from "@mui/material/styles"

export const StyledRoot = styled("div")(({ theme }) => ({
  borderRadius: 12,
  overflow: "hidden",
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  transition: "transform .2s ease, box-shadow .2s ease",

  "&:hover .img-wrapper img": {
    transform: "scale(1.08)",
  },

  "& .img-wrapper": {
    position: "relative",
    backgroundColor: theme.palette.grey[50],

    img: {
      width: "100%",
      height: "auto",
      transition: "transform .3s ease",
    },
  },

  "& .content": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",

    padding: theme.spacing(1),

    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(1.5),
    },

    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(2),
    },
  },
}))

export const PriceText = styled("p")(({ theme }) => ({
  fontWeight: 600,
  lineHeight: 1,
  marginTop: theme.spacing(1),
  color: theme.palette.primary.main,

  fontSize: 12,

  [theme.breakpoints.up("sm")]: {
    fontSize: 13,
  },

  [theme.breakpoints.up("md")]: {
    fontSize: 14,
  },

  ".base-price": {
    marginLeft: 8,
    textDecoration: "line-through",
    color: theme.palette.grey[600],
    fontSize: 11,

    [theme.breakpoints.up("md")]: {
      fontSize: 13,
    },
  },
}))
