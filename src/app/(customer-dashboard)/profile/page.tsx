"use client"
import { useUser } from "@/contexts/UserContenxt"

import { notFound } from "next/navigation"
import { ProfilePageView } from "pages-sections/customer-dashboard/profile/page-view"
// API FUNCTIONS




const  Profile = ()=> {
  const {user} = useUser()
 

  if (!user) notFound()

  return <ProfilePageView user={user} />
  
}

export default Profile
