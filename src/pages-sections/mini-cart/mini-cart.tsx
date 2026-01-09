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
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
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

  /**
   * Group cart items by category (unitName)
   */
  const tabsData = useMemo(() => {
    return state.cart.reduce<Record<string, Cart[]>>((acc, item) => {
      if (!acc[item.unitName!]) {
        acc[item.unitName!] = []
      }
      acc[item.unitName!].push(item)
      return acc
    }, {})
  }, [state.cart])

  const tabKeys = Object.keys(tabsData)

  const [activeTab, setActiveTab] = useState(tabKeys[0])

  /**
   * Keep active tab valid
   */
  useEffect(() => {
    if (!tabsData[activeTab]) {
      setActiveTab(tabKeys[0])
    }
  }, [tabsData, activeTab, tabKeys])

  /**
   * Quantity change
   */
  const handleCartAmountChange = (amount: number, product: Cart) => () => {
    dispatch({
      type: "CHANGE_CART_AMOUNT",
      payload: { ...product, qty: amount },
      isLoggedIn: !!user,
      user: user ?? undefined
    })
  }

  /**
   * Checkout only selected category
   */
  const checkOut = () => {
    const selectedItems = tabsData[activeTab]

    if (!selectedItems?.length) return

    const businessUnitId = selectedItems[0].businessUnitId
    console.warn(businessUnitId)

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
 {/* CATEGORY BAR (WRAPS DOWN WHEN LARGE) */}
{tabKeys.length > 0 && (
  <Box
    sx={{
      px: 2,
      pt: 1,
      display: "flex",
      gap: 1,
      flexWrap: "wrap"
    }}
  >
    {tabKeys.map((key) => {
      const isActive = activeTab === key

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
            borderColor: isActive ? "primary.main" : "divider",
            bgcolor: isActive ? "primary.light" : "transparent",
            color: isActive ? "primary.main" : "text.primary",
            "&:hover": {
              bgcolor: isActive ? "primary.light" : "action.hover"
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
            color="primary"
            variant="contained"
            onClick={checkOut}
            sx={{ height: 44, mb: 1 }}
          >
            Proceed to Checkout
          </Button>

          <Button
            fullWidth
            color="primary"
            variant="outlined"
            LinkComponent={Link}
            href="/cart"
            onClick={() => setOpen(false)}
            sx={{ height: 44 }}
          >
            View Cart
          </Button>
        </Box>
      )}
    </Box>
  )
}
