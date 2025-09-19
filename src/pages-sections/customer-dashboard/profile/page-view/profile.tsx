

import { Fragment } from "react"
// CUSTOM COMPONENTS
// import UserInfo from "../user-info"
// import UserAnalytics from "../user-analytics"
// CUSTOM DATA MODEL



import { UserProfile } from "@/models/User.model"
import UserInfo from "../user-info"

// ============================================================
type Props = { user: UserProfile };
// ============================================================

export function ProfilePageView({ user }: Props) {
  return (
    <Fragment>
      {/* <DashboardHeader title="My Profile" Icon={User3} /> */}
      {/* <UserAnalytics user={user} /> */}
      <UserInfo user={user} />
    </Fragment>
  )
}
