"use client"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
// MUI
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
// GLOBAL CUSTOM COMPONENTS
import { FormProvider, TextField } from "components/form-hook"
import { SaveUserProfilePayload, UserProfile } from "@/models/User.model"
import { getProfileInitialValue, profileSchema, ProfileSchemaType } from "@/schema/profile/profile.schema"
import { saveUserProfile } from "@/utils/api/profile"
import { useUser } from "@/contexts/UserContenxt"
import { useState } from "react"
// CUSTOM DATA MODEL

// ==============================================================
type Props = { user: UserProfile };
// ==============================================================

export default function ProfileEditForm({ user }: Props) {

  const userState = useUser()

  const [isSaving, setIsSaving] = useState(false)

  const methods = useForm({
    defaultValues: getProfileInitialValue(user),
    resolver: yupResolver(profileSchema)
  })

  const {
    handleSubmit,
  } = methods

  const handleSubmitForm = handleSubmit((values) => {
    save(values)
  })

  const save = async (values: ProfileSchemaType) => {
    setIsSaving(true)
    const payload: SaveUserProfilePayload = {
      CustomerProfileDtl: {
        ...user,
        custFName: values.firstName,
        custLName: values.lastName,
        custMName: values.middleName,
        custEmail: values.email,
        custPhone: values.contact
      },
      Token: userState.user!.token
    }
    try {
      await saveUserProfile(payload)
    } catch {

    } finally {
      setIsSaving(false)
    }
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      <Grid container spacing={3}>
        <Grid size={{ md: 6, xs: 12 }}>
          <TextField size="medium" fullWidth name="firstName" label="First Name" />
        </Grid>

        <Grid size={{ md: 6, xs: 12 }}>
          <TextField size="medium" fullWidth name="middleName" label="Middle Name" />
        </Grid>

        <Grid size={{ md: 6, xs: 12 }}>
          <TextField size="medium" fullWidth name="lastName" label="Last Name" />
        </Grid>

        <Grid size={{ md: 6, xs: 12 }}>
          <TextField size="medium" fullWidth name="email" type="email" label="Email" />
        </Grid>

        <Grid size={{ md: 6, xs: 12 }}>
          <TextField size="medium" fullWidth label="Phone" name="contact" />
        </Grid>

        <Grid size={12}>
          <Button
            disableElevation
            size="large"
            type="submit"
            color="primary"
            variant="contained"
            loading={isSaving}
          >
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </FormProvider>
  )
}
