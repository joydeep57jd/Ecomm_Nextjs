import CustomerDashboardLayout from "@/components/layouts/customer-dashboard/layout"
import type { PropsWithChildren } from "react"

export default function Layout({ children }: PropsWithChildren) {
  return <CustomerDashboardLayout>{children}</CustomerDashboardLayout>
}
