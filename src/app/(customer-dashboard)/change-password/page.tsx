"use client"
import Password from "@/icons/Password"
import DashboardHeader from "@/pages-sections/customer-dashboard/dashboard-header"
import { ChangePasswordPageView } from "@/pages-sections/customer-dashboard/profile/page-view/change-password-edit"

const ChangePassword = () => {

  return <>
    <DashboardHeader Icon={Password} title="Change Password" />
    <ChangePasswordPageView />
  </>
}

export default ChangePassword
