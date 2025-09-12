"use client"



import { useUser } from "@/contexts/UserContenxt"

import { notFound } from "next/navigation"
import { ProfileEditPageView } from "pages-sections/customer-dashboard/profile/page-view"






const ProfileEdit = () => {
 const {user} = useUser()

  if (!user) {
    return notFound()
  }

  return <ProfileEditPageView user={user} />
}
export default ProfileEdit
