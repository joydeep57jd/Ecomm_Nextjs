"use client"
import Drawer from "@mui/material/Drawer"
// GLOBAL CUSTOM COMPONENTS
import { MiniCart } from "pages-sections/mini-cart"
import { useCartDrawer } from "@/contexts/CartDrawerContext"

export default function MiniCartDrawer() {
  const { open, setOpen } = useCartDrawer()
  return (
    <Drawer open={open} anchor="right" onClose={() => setOpen(false)} sx={{ zIndex: 9999 }}>
      <MiniCart />
    </Drawer>
  )
}
