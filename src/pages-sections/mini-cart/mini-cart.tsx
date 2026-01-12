"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

// MUI
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Clear from "@mui/icons-material/Clear"

// Hooks & Context
import useCart from "hooks/useCart"
import { useUser } from "@/contexts/UserContenxt"
import { useCartDrawer } from "@/contexts/CartDrawerContext"

// Components
import MiniCartItem from "./components/cart-item"
import EmptyCartView from "./components/empty-view"
import { FlexBetween } from "components/flex-box"
import OverlayScrollbar from "components/overlay-scrollbar"

// Types
import { Cart } from "@/models/CartProductItem.models"

export default function MiniCart() {
  const Router = useRouter()
  const { user } = useUser()
  const { state, dispatch } = useCart()
  const { setOpen } = useCartDrawer()

  const CART_LENGTH = state.cart.length

  const tabsData = useMemo(() => {
    return state.cart.reduce<Record<string, Cart[]>>((acc, item) => {
      if (!acc[item.unitName!]) acc[item.unitName!] = []
      acc[item.unitName!].push(item)
      return acc
    }, {})
  }, [state.cart])

  const tabKeys = Object.keys(tabsData)
  const [activeTab, setActiveTab] = useState(tabKeys[0])

  // Extract colors for the CURRENT active tab (for the Checkout button)
  const activeStyles = useMemo(() => {
    const firstItem = tabsData[activeTab]?.[0]
    return {
      bg: firstItem?.backgroundColor || "#F3F5F9",
      font: firstItem?.fontFontColor || "#2B3445"
    }
  }, [activeTab, tabsData])

  useEffect(() => {
    if (!tabsData[activeTab] && tabKeys.length > 0) {
      setActiveTab(tabKeys[0])
    }
  }, [tabsData, activeTab, tabKeys])

  const handleCartAmountChange = (amount: number, product: Cart) => () => {
    dispatch({
      type: "CHANGE_CART_AMOUNT",
      payload: { ...product, qty: amount },
      isLoggedIn: !!user,
      user: user ?? undefined
    })
  }

  const checkOut = () => {
    const selectedItems = tabsData[activeTab]
    if (!selectedItems?.length) return
    const businessUnitId = selectedItems[0].businessUnitId
    setOpen(false)
    Router.push(user ? `/checkout?businessUnitId=${businessUnitId}` : "/login")
  }

  return (
    <Box height="100vh" width={380}>
      {/* HEADER */}
      <FlexBetween ml={3} mr={2} height={74}>
        <Typography variant="h6">Your Cart ({CART_LENGTH})</Typography>
        <IconButton size="small" onClick={() => setOpen(false)}>
          <Clear fontSize="small" />
        </IconButton>
      </FlexBetween>

      <Divider />

      {/* CATEGORY TABS */}
      {tabKeys.length > 0 && (
        <Box sx={{ px: 2, pt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
          {tabKeys.map((key) => {
            const isActive = activeTab === key
            const firstItemInTab = tabsData[key][0]
            const tabBg = firstItemInTab?.backgroundColor || "#E8F5E9"
            const tabFont = firstItemInTab?.fontFontColor || "#1B5E20"

            return (
              <Button
                key={key}
                size="small"
                onClick={() => setActiveTab(key)}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  px: 1.5,
                  minHeight: 32,
                  fontSize: 13,
                  border: "1px solid",
                  // Apply dynamic colors only when active
                  borderColor: isActive ? tabFont : "divider",
                  bgcolor: isActive ? tabBg : "transparent",
                  color: isActive ? tabFont : "text.secondary",
                  fontWeight: isActive ? 700 : 400,
                  "&:hover": {
                    bgcolor: isActive ? tabBg : "action.hover",
                    borderColor: isActive ? tabFont : "divider",
                  }
                }}
              >
                {key} ({tabsData[key].length})
              </Button>
            )
          })}
        </Box>
      )}

      {/* CART ITEMS */}
      <Box height={`calc(100% - ${CART_LENGTH ? "293px" : "75px"})`}>
        {CART_LENGTH > 0 ? (
          <OverlayScrollbar>
            {tabsData[activeTab]?.map((item) => (
              <MiniCartItem
                key={`${item.productId}-${item.itemVariantId}`}
                item={item}
                onCart={handleCartAmountChange}
              />
            ))}
          </OverlayScrollbar>
        ) : (
          <EmptyCartView />
        )}
      </Box>

      {/* ACTIONS */}
      {CART_LENGTH > 0 && (
        <Box p={2.5}>
          <Button
            fullWidth
            variant="contained"
            onClick={checkOut}
            sx={{ 
              height: 44, 
              mb: 1,
              // Button color matches the active category's font color
              backgroundColor: activeStyles.font,
              color: "#ffffff",
              "&:hover": {
                backgroundColor: activeStyles.font,
                opacity: 0.9
              }
            }}
          >
            Proceed to Checkout
          </Button>

          <Button
            fullWidth
            variant="outlined"
            LinkComponent={Link}
            href="/cart"
            onClick={() => setOpen(false)}
            sx={{ 
              height: 44,
              borderColor: activeStyles.font,
              color: activeStyles.font,
              "&:hover": {
                borderColor: activeStyles.font,
                backgroundColor: activeStyles.bg
              }
            }}
          >
            View Cart
          </Button>
        </Box>
      )}
    </Box>
  )
}