import type { Metadata } from "next"
import CustomerDashboardLayout from "@/components/layouts/customer-dashboard/layout"
import { PropsWithChildren } from "react"

export const metadata: Metadata = {
  title: "My Orders - Super Shop",
  description: "View your order history and track deliveries."
}

export default function Layout({ children }: PropsWithChildren) {
  return <CustomerDashboardLayout>{children}</CustomerDashboardLayout>
}
