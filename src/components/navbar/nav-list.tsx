/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useRouter, useSearchParams } from "next/navigation"
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
import { useCallback } from "react"

// ==============================================================
type Props = { navigation: Category[] };
// ==============================================================

export function NavigationList({ navigation }: Props) {

  const router = useRouter()
  const searchParams = useSearchParams()

  const navigateTo = useCallback((e: any, paramKeyName: string, paramValue: string) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    params.set(paramKeyName, paramValue)
    router.push(`/products/search?${params.toString()}`)
  }, [router, searchParams])

  const renderSubSubCategory = (children: SubSubCategory[]) => {
    return children.map((nav) => (
      <NavLink onClick={(e) => navigateTo(e, "subSubCategory", nav.id)} href={`/products/search?subSubCategory=${nav.id}`} key={nav.name}>
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
              url: `/products/search?subCategory=${sub.id}`,
            })),
          }} key={nav.name}>
            {renderSubSubCategory(nav.sub_sub_category)}
          </NavItemChild>
        )
      }

      return (
        <NavLink onClick={(e) => navigateTo(e, "subCategory", nav.id)} href={`/products/search?subCategory=${nav.id}`} key={nav.name}>
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
        <NavLink onClick={(e) => navigateTo(e, "category", nav.id)} href={`/products/search?category=${nav.id}`} key={nav.name}>
          <FlexBox alignItems="flex-end" gap={0.3} sx={NAV_LINK_STYLES}>
            {nav.name}
            <KeyboardArrowDown
              sx={{
                color: "grey.500",
                fontSize: "1.1rem"
              }}
            />
          </FlexBox>
        </NavLink>

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
