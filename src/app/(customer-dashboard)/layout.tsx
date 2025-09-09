import type { PropsWithChildren } from "react"
import HeaderLayout from "@/components/layouts/header-layout"

export default async function Layout1({ children }: PropsWithChildren) {

  return <HeaderLayout>{children}</HeaderLayout>
}
