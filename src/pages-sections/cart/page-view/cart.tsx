"use client"

import { useEffect, useMemo, useState } from "react"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"

import useCart from "hooks/useCart"
import CartItem from "../cart-item"
import EmptyCart from "../empty-cart"
import CheckoutForm from "../checkout-form"

export default function CartPageView() {
  const {
    state: { cart }
  } = useCart()

  const tabsData = useMemo(() => {
    return cart.reduce<Record<string, typeof cart>>((acc, item) => {
      if (!acc[item.unitName!]) acc[item.unitName!] = []
      acc[item.unitName!].push(item)
      return acc
    }, {})
  }, [cart])

  const tabKeys = Object.keys(tabsData)
  const [activeTab, setActiveTab] = useState(tabKeys[0])
  const activeCartItems = tabsData[activeTab] || []

  // Extract colors specifically for the active brand/unit
  const activeStyles = useMemo(() => {
    const firstItem = activeCartItems[0]
    return {
      bg: firstItem?.backgroundColor || "#E8F5E9",
      font: firstItem?.fontFontColor || "#1B5E20"
    }
  }, [activeCartItems])

  useEffect(() => {
    if (!tabsData[activeTab] && tabKeys.length > 0) {
      setActiveTab(tabKeys[0])
    }
  }, [tabsData, activeTab, tabKeys])

  if (!cart || cart.length === 0) return <EmptyCart />

  return (
    <Grid container spacing={3}>
      {/* LEFT SIDE */}
      <Grid size={{ md: 8, xs: 12 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            variant="scrollable"
            scrollButtons="auto"
            // Set the underline color
            TabIndicatorProps={{
              style: { backgroundColor: activeStyles.font }
            }}
          >
            {tabKeys.map((key) => (
              <Tab
                key={key}
                value={key}
                label={`${key} (${tabsData[key].length})`}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  // Style for the selected tab only
                  "&.Mui-selected": {
                    backgroundColor: activeStyles.bg,
                    color: activeStyles.font
                  }
                }}
              />
            ))}
          </Tabs>
        </Box>

        {activeCartItems.map((item) => (
          <CartItem key={`${item.productId}-${item.itemVariantId}`} item={item} />
        ))}
      </Grid>

      {/* RIGHT SIDE */}
      <Grid size={{ md: 4, xs: 12 }}>
        <CheckoutForm cartItems={activeCartItems} />
      </Grid>
    </Grid>
  )
}
