import CustomerDashboardLayout from "@/components/layouts/customer-dashboard/layout"
import { PropsWithChildren } from "react"

export default function Layout({ children }: PropsWithChildren) {
  return <CustomerDashboardLayout>{children}</CustomerDashboardLayout>
}
