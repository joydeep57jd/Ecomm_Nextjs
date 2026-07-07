/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useRouter } from "next/navigation"
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
import { useCallback, useEffect } from "react"
import LayoutModel from "@/models/Layout.model"
import { setItem } from "@/utils/services/local-storage.service"
import { encodeId } from "@/utils/url-id"

// Title-case a string ("GARMENT & FASHION" -> "Garment & Fashion").
// CSS text-transform: capitalize can't lowercase the rest of an all-caps word, so do it in JS.
const toTitleCase = (text: string) =>
  text
    ?.toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase()) ?? ""

// ==============================================================
type Props = { navigation: Category[]; layoutModel: LayoutModel }
// ==============================================================

export function NavigationList({ navigation, layoutModel }: Props) {
  useEffect(() => {
    setItem("layout", layoutModel)
  }, [layoutModel])

  const router = useRouter()

  const navigateTo = useCallback(
    (e: any, entries: [string, string][]) => {
      e.preventDefault()
      const params = new URLSearchParams()
      entries.forEach(([key, value]) => params.set(key, encodeId(value)))
      router.push(`/products/search?${params.toString()}`)
    },
    [router]
  )

  // Subcategory/sub-subcategory links must carry their ancestor ids too, otherwise the
  // search page's category filter sidebar can't tell which parent category to highlight.
  const renderSubSubCategory = (children: SubSubCategory[], categoryId: string, subCategoryId: string) => {
    return children?.map((nav) => (
      <NavLink
        key={nav.id}
        onClick={(e) =>
          navigateTo(e, [
            ["category", categoryId],
            ["subCategory", subCategoryId],
            ["SubCategory", nav.id]
          ])
        }
        href={`/products/search?category=${encodeId(categoryId)}&subCategory=${encodeId(subCategoryId)}&SubCategory=${encodeId(nav.id)}`}
      >
        <MenuItem>{toTitleCase(nav.name)}</MenuItem>
      </NavLink>
    ))
  }

  const renderSubCategory = (children: SubCategory[], categoryId: string) => {
    return children?.map((nav) => {
      if (nav.sub_sub_category.length) {
        return (
          <NavItemChild
            nav={{
              title: toTitleCase(nav.name),
              child: nav.sub_sub_category.map((sub) => ({
                title: toTitleCase(sub.name),
                url: `/products/search?category=${encodeId(categoryId)}&subCategory=${encodeId(nav.id)}&SubCategory=${encodeId(sub.id)}`
              }))
            }}
            onNavigate={(e) =>
              navigateTo(e, [
                ["category", categoryId],
                ["subCategory", nav.id]
              ])
            }
            key={nav.name}
          >
            {renderSubSubCategory(nav.sub_sub_category, categoryId, nav.id)}
          </NavItemChild>
        )
      }

      return (
        <NavLink
          onClick={(e) =>
            navigateTo(e, [
              ["category", categoryId],
              ["subCategory", nav.id]
            ])
          }
          href={`/products/search?category=${encodeId(categoryId)}&subCategory=${encodeId(nav.id)}`}
          key={nav.name}
        >
          <MenuItem>{toTitleCase(nav.name)}</MenuItem>
        </NavLink>
      )
    })
  }

  const renderRootLevel = (list: Category[]) => {
    return list?.map((nav) => (
      <FlexBox
        key={nav.name}
        alignItems="center"
        position="relative"
        flexDirection="column"
        sx={{
          borderRadius: 1,
          flexShrink: 0,
          whiteSpace: "nowrap",
          transition: "background-color 150ms ease-in-out",
          "&:hover": {
            backgroundColor: "action.hover",
            "& > .child-nav-item": {
              display: "block"
            }
          }
        }}
      >
        <NavLink
          onClick={(e) => navigateTo(e, [["category", nav.id]])}
          href={`/products/search?category=${encodeId(nav.id)}`}
          key={nav.name}
        >
          <FlexBox alignItems="flex-end" gap={0.3} sx={{ ...NAV_LINK_STYLES, px: 1, py: 0.75, fontSize: 14, whiteSpace: "nowrap" }}>
            {toTitleCase(nav.name)}
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
            {renderSubCategory(nav.sub_category, nav.id)}
          </Card>
        </ChildNavListWrapper>
      </FlexBox>
    ))
  }

  return <FlexBox gap={1} sx={{ flexShrink: 0 }}>{renderRootLevel(navigation)}</FlexBox>
}
