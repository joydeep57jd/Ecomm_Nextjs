import type { Metadata } from "next"
import CustomerDashboardLayout from "@/components/layouts/customer-dashboard/layout"
import type { PropsWithChildren } from "react"

export const metadata: Metadata = {
  title: "My Addresses - Super Shop",
  description: "Manage your saved delivery addresses."
}

export default function Layout({ children }: PropsWithChildren) {
  return <CustomerDashboardLayout>{children}</CustomerDashboardLayout>
}
