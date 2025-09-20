import { Fragment } from "react"
import Card from "@mui/material/Card"
// LOCAL CUSTOM COMPONENT
// CUSTOM DATA MODEL

import ProfileEditForm from "../edit-form"
import { UserProfile } from "@/models/User.model"

// ===========================================================
type Props = { user: UserProfile };
// ===========================================================

export function ProfileEditPageView({ user }: Props) {
  return (
    <Fragment>
      <Card sx={{ padding: { xs: 3, sm: 4 } }}>
        {user && <ProfileEditForm user={user} />}
      </Card>
    </Fragment>
  )
}
