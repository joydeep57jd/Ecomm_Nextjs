import { Fragment } from "react"
import Card from "@mui/material/Card"
import { UserProfile } from "@/models/User.model"
import ChangePasswordForm from "../change-password-form"


type Props = { user: UserProfile }

export function ChangePasswordPageView({ user }: Props) {
  return (
    <Fragment>
      <Card sx={{ padding: { xs: 3, sm: 4 } }}>
        <ChangePasswordForm user={user} />
      </Card>
    </Fragment>
  )
}
