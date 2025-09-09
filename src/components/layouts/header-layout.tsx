"use client"

import { useEffect, useState } from "react"
import type { PropsWithChildren } from "react"
import ShopLayout1 from "components/layouts/shop-layout-1"
// API FUNCTIONS
import api from "@/utils/api/category"
import LayoutModel from "@/models/Layout.model"

export default function HeaderLayout({ children }: PropsWithChildren) {
  const [data, setData] = useState<LayoutModel>({})

  const getCategoriesData = async () => {
    try {
      const data = await api.getLayoutData()
      setData(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  useEffect(() => {
    getCategoriesData()
  }, [])

  return <ShopLayout1 data={data}>{children}</ShopLayout1>
}
