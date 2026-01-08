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

  if (!cart || cart.length === 0) {
    return <EmptyCart />
  }


  const tabsData = useMemo(() => {
    return cart.reduce<Record<string, typeof cart>>((acc, item) => {
      if (!acc[item.unitName!]) {
        acc[item.unitName!] = []
      }
      acc[item.unitName!].push(item)
      return acc
    }, {})
  }, [cart])

  const tabKeys = Object.keys(tabsData)
  const [activeTab, setActiveTab] = useState(tabKeys[0])
  const activeCartItems = tabsData[activeTab] || []
 
  useEffect(() => {
    if (!tabsData[activeTab]) {
      setActiveTab(tabKeys[0])
    }
  }, [tabsData, activeTab, tabKeys])

  return (
    <Grid container spacing={3}>
      {/* LEFT SIDE */}
      <Grid size={{ md: 8, xs: 12 }}>
        {/* TOP TABS */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabKeys.map((key) => (
              <Tab
                key={key}
                value={key}
                label={`${key} (${tabsData[key].length})`}
              />
            ))}
          </Tabs>
        </Box>

        {/* CART ITEMS BASED ON TAB */}
        {tabsData[activeTab].map((item) => (
          <CartItem
            key={`${item.productId}-${item.itemVariantId}`}
            item={item}
          />
        ))}
      </Grid>

      {/* RIGHT SIDE */}
      <Grid size={{ md: 4, xs: 12 }}>
         <CheckoutForm cartItems={activeCartItems} />
      </Grid>
    </Grid>
  )
}
