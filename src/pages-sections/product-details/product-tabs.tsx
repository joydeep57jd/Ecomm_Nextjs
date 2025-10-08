"use client"

import { Fragment, ReactNode, SyntheticEvent, useState } from "react"
// MUI
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import { styled } from "@mui/material/styles"
import { on } from "events"

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
  reviews: ReactNode;
  description: ReactNode;
    activeTab: number
  onTabChange: (value: number) => void
}
// ==============================================================

export default function ProductTabs({ reviews, description,activeTab, onTabChange }: Props) {
  const [selectedOption, setSelectedOption] = useState(0)
  const handleChangeTab = (_: SyntheticEvent, value: number) => onTabChange(value)
  // const handleChangeTab = (_: SyntheticEvent, value: number) => setSelectedOption(value)

  return (
    <Fragment>
      <StyledTabs
        textColor="primary"
        value={activeTab}
        indicatorColor="primary"
        onChange={handleChangeTab}
      >
        <Tab className="inner-tab" label="Description" />
        <Tab className="inner-tab" label="Review" />
      </StyledTabs>

      <div className="mb-3">
        {/* {selectedOption === 0 && description}
        {selectedOption === 1 && reviews} */}
        {activeTab === 0 && description}
        {activeTab === 1 && reviews}
      </div>
    </Fragment>
  )
}
