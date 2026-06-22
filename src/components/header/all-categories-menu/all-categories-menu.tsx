"use client"

import NextLink from "next/link"
import MuiLink from "@mui/material/Link"
import MenuIcon from "@mui/icons-material/Menu"
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown"
// DATA TYPES
import { Category } from "@/models/Category.modal"
import { encodeId } from "@/utils/url-id"
// STYLED COMPONENTS
import { MenuRoot, TriggerButton, Panel, ColumnBox } from "./styles"

const COLUMN_COLORS = ["#abdaaf", "info", "error", "warning", "secondary"] as const

interface Props {
  categories: Category[]
}

export function AllCategoriesMenu({ categories }: Props) {
  if (!categories?.length) return null

  return (
    <MenuRoot>
      <TriggerButton>
        <MenuIcon fontSize="small" />
        All Categories
        <KeyboardArrowDown className="dropdown-icon" fontSize="small" />
      </TriggerButton>

      <Panel className="all-categories-panel" role="menu" aria-label="All categories">
        {categories.map((category, index) => {
          const colorKey = COLUMN_COLORS[index % COLUMN_COLORS.length]

          return (
            <ColumnBox key={category.id} sx={{ bgcolor: `${colorKey}.light` }}>
              <MuiLink
                component={NextLink}
                href={`/products/search?category=${encodeId(category.id)}`}
                className="col-title"
                sx={{ color: `${colorKey}.main` }}
              >
                {category.name}
              </MuiLink>

              {category.sub_category?.map((sub) => (
                <NextLink
                  key={sub.id}
                  href={`/products/search?subCategory=${encodeId(sub.id)}`}
                  className="sub-link"
                >
                  {sub.name}
                </NextLink>
              ))}
            </ColumnBox>
          )
        })}
      </Panel>
    </MenuRoot>
  )
}
