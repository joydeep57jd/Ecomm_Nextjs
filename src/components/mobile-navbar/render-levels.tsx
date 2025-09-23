/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from "@mui/material/Box"
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import ExpandMore from "@mui/icons-material/ExpandMore"
import Typography from "@mui/material/Typography"
// GLOBAL CUSTOM COMPONENTS
import { NavLink } from "components/nav-link"

const ACCORDION_STYLES = {
  "&:not(:last-child)": { borderBottom: 0 },
  "&:before": { display: "none" }
}

const ACCORDION_SUMMARY_STYLES = {
  padding: 0,
  minHeight: 48,
  boxShadow: "none",
  "& .Mui-expanded": { color: "primary.main", margin: 0 },
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    margin: 0,
    "& .MuiSvgIcon-root": { color: "primary.main" }
  }
}

export const renderLevels = (data: any[], handleClose: () => void) => {
  return data.map((item: any, index: number) => {
    let children = []
    let keyName = ''

    if (!!item.sub_category) {
      keyName = 'category'
      children = item.sub_category
    } else if (!!item.sub_sub_category) {
      keyName = 'subCategory'
      children = item.sub_sub_category
    } else {
      keyName = 'subSubCategory'
    }

    const href = `/products/search?${keyName}=${item.id}`
    if (children?.length) {
      return (
        <Accordion square key={index} elevation={0} disableGutters sx={ACCORDION_STYLES}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={ACCORDION_SUMMARY_STYLES}>
            <NavLink href={href ?? ''} onClick={handleClose}>
              <Typography variant="h6">{item.name}</Typography>
            </NavLink>
          </AccordionSummary>

          <Box mx={2}>{renderLevels(children, handleClose)}</Box>
        </Accordion>
      )
    }


    return (
      <Box key={index} py={1}>
        <NavLink href={href ?? ''} onClick={handleClose}>
          {item.name}
        </NavLink>
      </Box>
    )
  })
}
