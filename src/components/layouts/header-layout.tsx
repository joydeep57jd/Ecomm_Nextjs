import type { PropsWithChildren } from "react"
import ShopLayout1 from "components/layouts/shop-layout-1"
// API FUNCTIONS
import api from "@/utils/api/layout"
import SyncCompanyInfo from "@/components/sync-company-info"

export default async function HeaderLayout({ children }: PropsWithChildren) {
  const data = await api.getLayoutData()

  return (
    <ShopLayout1 data={data}>
      <SyncCompanyInfo companyInfo={data.companyInfo} />
      {children}
    </ShopLayout1>
  )
}
