"use client"
import { useUser } from "@/contexts/UserContenxt"
import { UserProfile } from "@/models/User.model"
import { userProfile } from "@/utils/api/profile"

import { notFound } from "next/navigation"
import { ProfilePageView } from "pages-sections/customer-dashboard/profile/page-view"
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
        console.warn("data", res)

        setProfile(res)
      } catch (err) {
        console.error("Failed to fetch profile", err)
      }
    }

    fetchProfile()
  }, [user])

  if (!user) return notFound()

  return <ProfilePageView user={profile!} />
}

export default Profile
