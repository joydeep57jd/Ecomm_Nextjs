import { Fragment } from "react"
import Card from "@mui/material/Card"
// LOCAL CUSTOM COMPONENT

import DashboardHeader from "../../dashboard-header"
// CUSTOM DATA MODEL

import { UserData } from "@/models/Auth.model"

// ===========================================================
type Props = { user: UserData };
// ===========================================================

export function ProfileEditPageView({  }: Props) {
  return (
    <Fragment>
      <DashboardHeader href="/profile" title="Edit Profile" />

      <Card sx={{ padding: { xs: 3, sm: 4 } }}>
        {/* <ProfilePicUpload image={user.avatar} />
        {user && <ProfileEditForm user={user} />} */}
      </Card>
    </Fragment>
  )
}
