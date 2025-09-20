"use client"
import Loading from "@/app/loading"
import { useUser } from "@/contexts/UserContenxt"
import { UserProfile } from "@/models/User.model"
import { userProfile } from "@/utils/api/profile"

import { ProfileEditPageView } from "pages-sections/customer-dashboard/profile/page-view"
import { useEffect, useState } from "react"
// API FUNCTIONS

const Profile = () => {
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

  return <ProfileEditPageView user={profile!} />
}

export default Profile
