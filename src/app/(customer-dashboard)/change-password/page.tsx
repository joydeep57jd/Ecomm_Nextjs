"use client"
import Loading from "@/app/loading"
import { useUser } from "@/contexts/UserContenxt"
import Password from "@/icons/Password"
import { UserProfile } from "@/models/User.model"
import DashboardHeader from "@/pages-sections/customer-dashboard/dashboard-header"
import { ChangePasswordPageView } from "@/pages-sections/customer-dashboard/profile/page-view/change-password-edit"
import { userProfile } from "@/utils/api/profile"

import { ProfileEditPageView } from "pages-sections/customer-dashboard/profile/page-view"
import { useEffect, useState } from "react"
// API FUNCTIONS

const ChangePassword = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const { user } = useUser()

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return
      try {
        const res = await userProfile(user?.id)
        setProfile(res)
      } catch (err) {
        console.error("Failed to fetch profile", err)
      }
    }
    fetchProfile()
  }, [user])

  if (!profile) {
    return <Loading isSmallLoader={true} />
  }

  return <>
    <DashboardHeader Icon={Password} title="Change Password" />
      <ChangePasswordPageView user={profile} />
  </>
}

export default ChangePassword
