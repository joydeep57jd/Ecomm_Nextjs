import type { PropsWithChildren } from "react"
import ShopLayout1 from "components/layouts/shop-layout-1"
// API FUNCTIONS
import api from "@/utils/api/category"

export default async function Layout1({ children }: PropsWithChildren) {
  const data = await api.getLayoutData()

  if (!data) return <>{children}</>

  return <ShopLayout1 data={data}>{children}</ShopLayout1>
}
