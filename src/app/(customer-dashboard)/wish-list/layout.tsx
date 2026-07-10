import type { Metadata } from "next"
import CustomerDashboardLayout from "@/components/layouts/customer-dashboard/layout"
import { PropsWithChildren } from "react"

export const metadata: Metadata = {
  title: "Wishlist - Super Shop",
  description: "View and manage the products you've saved for later."
}

export default function Layout({ children }: PropsWithChildren) {
  return <CustomerDashboardLayout>{children}</CustomerDashboardLayout>
}
