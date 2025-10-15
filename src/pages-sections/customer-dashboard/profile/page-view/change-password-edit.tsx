import { Fragment } from "react"
import Card from "@mui/material/Card"
import ChangePasswordForm from "../change-password-form"



export function ChangePasswordPageView() {
  return (
    <Fragment>
      <Card sx={{ padding: { xs: 3, sm: 4 } }}>
        <ChangePasswordForm />
      </Card>
    </Fragment>
  )
}
