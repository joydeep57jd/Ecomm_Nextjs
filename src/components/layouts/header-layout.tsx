export const dynamic = 'force-dynamic'

import type { PropsWithChildren } from "react"
import ShopLayout1 from "components/layouts/shop-layout-1"
// API FUNCTIONS
import api from "@/utils/api/layout"

export default async function HeaderLayout({ children }: PropsWithChildren) {
  const data = await api.getLayoutData()

  return <ShopLayout1 data={data}>{children}</ShopLayout1>
}
