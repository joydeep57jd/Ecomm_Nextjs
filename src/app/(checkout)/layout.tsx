import HeaderLayout from "@/components/layouts/header-layout"
import type { PropsWithChildren } from "react"

export default async function CheckoutGroupLayout({ children }: PropsWithChildren) {
  return <HeaderLayout>{children}</HeaderLayout>
}
