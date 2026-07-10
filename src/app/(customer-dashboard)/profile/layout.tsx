import type { Metadata } from "next"
import CustomerDashboardLayout from "@/components/layouts/customer-dashboard/layout"
import { PropsWithChildren } from "react"

export const metadata: Metadata = {
  title: "My Profile - Super Shop",
  description: "View and edit your account profile."
}

export default function Layout({ children }: PropsWithChildren) {
  return <CustomerDashboardLayout>{children}</CustomerDashboardLayout>
}
