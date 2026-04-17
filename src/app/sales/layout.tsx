// import type { PropsWithChildren } from "react"
// // GLOBAL CUSTOM COMPONENTS

// // API FUNCTIONS
// import api from "@/utils/api/layout"
// import ShopLayout1 from "@/components/layouts/shop-layout-1"

// export default async function Layout({ children }: PropsWithChildren) {
//   const data = await api.getLayoutData()
//   return <ShopLayout1 data={data}>{children}</ShopLayout1>
// }

import type { PropsWithChildren } from "react"

export default function Layout({ children }: PropsWithChildren) {
  return <>{children}</>
}
