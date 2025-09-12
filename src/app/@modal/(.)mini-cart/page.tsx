"use client"

import { useRouter } from "next/navigation"
import Drawer from "@mui/material/Drawer"
// GLOBAL CUSTOM COMPONENTS
import { MiniCart } from "pages-sections/mini-cart"

export default function MiniCartDrawer() {
  const router = useRouter()

  return (
    <Drawer open anchor="right" onClose={router.back} sx={{ zIndex: 9999 }}>
      <MiniCart />
    </Drawer>
  )
}
