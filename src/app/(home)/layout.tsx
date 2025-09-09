"use client"

import type { PropsWithChildren } from "react"
import ShopLayout1 from "components/layouts/shop-layout-1"
// API FUNCTIONS
import api from "@/utils/api/category"

import { useEffect, useState } from "react"
import { CategoryResponse } from "@/models/categorytypes.modal"

export default function Layout1({ children }: PropsWithChildren) {
  const [data, setData] = useState<CategoryResponse[]>([])

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
