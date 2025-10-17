"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import { FormProvider, TextField } from "components/form-hook"
import { useUser } from "@/contexts/UserContenxt"
import { changePassword } from "@/utils/api/auth"
import { ChangePasswordPayload } from "@/models/Auth.model"
import {
  ChangePasswordFormType,
  changePasswordSchema
} from "@/schema/profile/changepassword.schema"
import EyeToggleButton from "@/pages-sections/sessions/components/eye-toggle-button"
import usePasswordVisible from "@/pages-sections/sessions/use-password-visible"
import { enqueueSnackbar } from "notistack"

export default function ChangePasswordForm() {
  const oldPasswordVisibility = usePasswordVisible()
  const newPasswordVisibility = usePasswordVisible()
  const confirmPasswordVisibility = usePasswordVisible()

  const { user: userCtx } = useUser()
  const [isSaving, setIsSaving] = useState(false)

  const methods = useForm<ChangePasswordFormType>({
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
    resolver: yupResolver(changePasswordSchema)
  })

  const { handleSubmit } = methods

  const handleSave = handleSubmit(async (values) => {
    setIsSaving(true)
    const payload: ChangePasswordPayload = {
      Token: userCtx!.token,
      UserId: userCtx!.id,
      OldPassword: values.oldPassword,
      NewPassword: values.newPassword
    }
    try {
      await changePassword(payload)
      enqueueSnackbar("Password changed successfully.", { variant: "success" })
    } catch (err) {
      enqueueSnackbar("Failed to change password", { variant: "error" })
      console.error("Failed to change password", err)
    } finally {
      setIsSaving(false)
    }
  })

  return (
    <FormProvider methods={methods} onSubmit={handleSave}>
      <Grid container spacing={3}>
        <Grid size={{ md: 6, xs: 12 }}>
          <TextField
            fullWidth
            size="medium"
            type={oldPasswordVisibility.visiblePassword ? "text" : "password"}
            name="oldPassword"
            label="Old Password"
            slotProps={{
              input: {
                endAdornment: (
                  <EyeToggleButton
                    show={oldPasswordVisibility.visiblePassword}
                    click={oldPasswordVisibility.togglePasswordVisible}
                  />
                )
              }
            }}
          />
        </Grid>

        <Grid size={{ md: 6, xs: 12 }}>
          <TextField
            fullWidth
            size="medium"
            type={newPasswordVisibility.visiblePassword ? "text" : "password"}
            name="newPassword"
            label="New Password"
            slotProps={{
              input: {
                endAdornment: (
                  <EyeToggleButton
                    show={newPasswordVisibility.visiblePassword}
                    click={newPasswordVisibility.togglePasswordVisible}
                  />
                )
              }
            }}
          />
        </Grid>

        <Grid size={{ md: 6, xs: 12 }}>
          <TextField
            fullWidth
            size="medium"
            type={confirmPasswordVisibility.visiblePassword ? "text" : "password"}
            name="confirmPassword"
            label="Confirm Password"
            slotProps={{
              input: {
                endAdornment: (
                  <EyeToggleButton
                    show={confirmPasswordVisibility.visiblePassword}
                    click={confirmPasswordVisibility.togglePasswordVisible}
                  />
                )
              }
            }}
          />
        </Grid>

        <Grid size={12}>
          <Button
            disableElevation
            size="large"
            type="submit"
            variant="contained"
            color="primary"
            loading={isSaving}
          >
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </FormProvider>
  )
}
