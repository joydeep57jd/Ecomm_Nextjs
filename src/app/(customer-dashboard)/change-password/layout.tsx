import type { Metadata } from "next"
import CustomerDashboardLayout from "@/components/layouts/customer-dashboard/layout"
import { PropsWithChildren } from "react"

export const metadata: Metadata = {
  title: "Change Password - Super Shop",
  description: "Update your account password."
}

export default function Layout({ children }: PropsWithChildren) {
  return <CustomerDashboardLayout>{children}</CustomerDashboardLayout>
}
