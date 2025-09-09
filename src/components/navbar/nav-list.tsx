"use client"

import Card from "@mui/material/Card"
import MenuItem from "@mui/material/MenuItem"
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown"
// GLOBAL CUSTOM COMPONENTS
import { NavLink } from "components/nav-link"
import FlexBox from "components/flex-box/flex-box"
// LOCAL CUSTOM COMPONENTS
import NavItemChild from "./nav-item-child"
// STYLED COMPONENTS
import { NAV_LINK_STYLES, ChildNavListWrapper } from "./styles"
// DATA TYPES
import { Category, SubCategory, SubSubCategory } from "@/models/Category.modal"

// ==============================================================
type Props = { navigation: Category[] };
// ==============================================================

export function NavigationList({ navigation }: Props) {

  const renderSubSubCategory = (children: SubSubCategory[]) => {
    return children.map((nav) => (
      <NavLink href={`/category/${nav.id}`} key={nav.name}>
        <MenuItem>{nav.name}</MenuItem>
      </NavLink>
    ))
  }

  const renderSubCategory = (children: SubCategory[]) => {
    return children.map((nav) => {
      if (nav.sub_sub_category.length) {
        return (
          <NavItemChild nav={{
            title: nav.name,
            child: nav.sub_sub_category.map((sub) => ({
              title: sub.name,
              url: `/category/${sub.id}`,
            })),
          }} key={nav.name}>
            {renderSubSubCategory(nav.sub_sub_category)}
          </NavItemChild>
        )
      }

      return (
        <NavLink href={`/category/${nav.id}`} key={nav.name}>
          <MenuItem>{nav.name}</MenuItem>
        </NavLink>
      )
    })
  }

  const renderRootLevel = (list: Category[]) => {
    return list.map((nav) => (
      <FlexBox
        key={nav.name}
        alignItems="center"
        position="relative"
        flexDirection="column"
        sx={{
          "&:hover": {
            "& > .child-nav-item": {
              display: "block"
            }
          }
        }}
      >
        <FlexBox alignItems="flex-end" gap={0.3} sx={NAV_LINK_STYLES}>
          {nav.name}
          <KeyboardArrowDown
            sx={{
              color: "grey.500",
              fontSize: "1.1rem"
            }}
          />
        </FlexBox>

        <ChildNavListWrapper className="child-nav-item">
          <Card
            elevation={5}
            sx={{
              mt: 2.5,
              py: 1,
              minWidth: 100,
              overflow: "unset"
            }}
          >
            {renderSubCategory(nav.sub_category)}
          </Card>
        </ChildNavListWrapper>
      </FlexBox>
    ))
  }

  return <FlexBox gap={4}>{renderRootLevel(navigation)}</FlexBox>
}
