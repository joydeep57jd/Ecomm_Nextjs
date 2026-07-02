"use client"

import { Fragment, ReactNode } from "react"
// MUI
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import { styled } from "@mui/material/styles"

// STYLED COMPONENT
const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: 0,
  marginTop: 80,
  marginBottom: 24,
  borderBottom: `1px solid ${theme.palette.divider}`,
  "& .inner-tab": {
    minHeight: 40,
    fontWeight: 500,
    textTransform: "capitalize"
  }
}))

// ==============================================================
interface Props {
  reviews: ReactNode
}
// ==============================================================

// Description and Specification now live in the Product Details section
// (see product-intro). This bottom section only hosts the Review tab.
export default function ProductTabs({ reviews }: Props) {
  return (
    <Fragment>
      <StyledTabs textColor="primary" value={0} indicatorColor="primary">
        <Tab className="inner-tab" label="Review" />
      </StyledTabs>

      <div className="mb-3">{reviews}</div>
    </Fragment>
  )
}
