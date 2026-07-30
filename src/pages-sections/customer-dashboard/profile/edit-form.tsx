"use client"

import { ReactNode, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
// MUI
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import Chip from "@mui/material/Chip"
import Grid from "@mui/material/Grid"
import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"
import InputAdornment from "@mui/material/InputAdornment"
import { alpha, styled } from "@mui/material/styles"
import PersonOutline from "@mui/icons-material/PersonOutline"
import LocationOnOutlined from "@mui/icons-material/LocationOnOutlined"
// GLOBAL CUSTOM COMPONENTS
import { FormProvider, TextField } from "components/form-hook"
import { FlexBetween, FlexBox } from "components/flex-box"
import AddressAutocomplete from "@/components/AddressAutocomplete"
import type { PlaceDetails } from "@/hooks/useGooglePlacesAutocomplete"
import { SaveUserProfilePayload, UserProfile } from "@/models/User.model"
import {
  getProfileInitialValue,
  profileSchema,
  ProfileSchemaType
} from "@/schema/profile/profile.schema"
import { saveUserProfile } from "@/utils/api/profile"
import { getApiErrorMessage } from "@/utils/api-error"
import { useUser } from "@/contexts/UserContenxt"
import { useSnackbar } from "notistack"
import { BRAND } from "@/theme/brand"
// CUSTOM DATA MODEL

// STYLED COMPONENTS
const SectionCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  border: "1px solid",
  borderColor: theme.palette.grey[100],
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  transition: "box-shadow .25s ease, border-color .25s ease",
  ":hover": {
    borderColor: alpha(BRAND.primary, 0.35),
    boxShadow: `0 6px 24px ${alpha(theme.palette.common.black, 0.06)}`
  },
  [theme.breakpoints.down("sm")]: { padding: theme.spacing(2.5) }
}))

/** Gives every input in the form a matching hover / focus treatment. */
const FieldGroup = styled("div")(() => ({
  ".MuiOutlinedInput-root": {
    transition: "box-shadow .2s ease",
    "&:hover:not(.Mui-error) .MuiOutlinedInput-notchedOutline": {
      borderColor: alpha(BRAND.primary, 0.6)
    },
    "&.Mui-focused:not(.Mui-error)": {
      boxShadow: `0 0 0 3px ${alpha(BRAND.primary, 0.15)}`,
      ".MuiOutlinedInput-notchedOutline": { borderColor: BRAND.primary }
    }
  },
  ".MuiInputLabel-root.Mui-focused:not(.Mui-error)": { color: BRAND.primary }
}))

// ==============================================================
type Props = { user: UserProfile }
// ==============================================================

export default function ProfileEditForm({ user }: Props) {
  const userState = useUser()

  const { enqueueSnackbar } = useSnackbar()

  const [isSaving, setIsSaving] = useState(false)
  // THE AUTOCOMPLETE KEEPS ITS OWN TEXT — REMOUNT IT WHEN THE FORM IS RESEEDED
  const [savedAddress1, setSavedAddress1] = useState(user.billAddr1 || "")
  const [addressKey, setAddressKey] = useState(0)

  const methods = useForm({
    defaultValues: getProfileInitialValue(user),
    resolver: yupResolver(profileSchema)
  })

  const {
    watch,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty }
  } = methods

  const [firstName, lastName, email] = watch(["firstName", "lastName", "email"])
  const fullName = [firstName, lastName].filter(Boolean).join(" ")
  const initials =
    `${firstName?.trim()?.[0] ?? ""}${lastName?.trim()?.[0] ?? ""}`.toUpperCase() || "?"

  const handleSubmitForm = handleSubmit((values) => {
    save(values)
  })

  // GOOGLE PLACES SELECTION FILLS THE BILLING ADDRESS FIELDS
  const handleAddressSelect = (details: PlaceDetails) => {
    const options = { shouldValidate: true, shouldDirty: true }
    setValue("address1", details.formattedAddress, options)
    setValue("pin", details.pincode, options)
    setValue("city", details.city, options)
    setValue("dist", details.district, { shouldDirty: true })
    setValue("state", details.state, options)
    setValue("country", details.country, options)
  }

  // KEEPS address1 IN SYNC WITH TYPED TEXT, EVEN WITHOUT PICKING A SUGGESTION
  const handleAddressTextChange = (value: string) => {
    setValue("address1", value, { shouldValidate: true, shouldDirty: true })
  }

  const handleReset = () => {
    reset()
    setAddressKey((key) => key + 1)
  }

  const save = async (values: ProfileSchemaType) => {
    setIsSaving(true)
    const payload: SaveUserProfilePayload = {
      CustomerProfileDtl: {
        ...user,
        custFName: values.firstName,
        custLName: values.lastName,
        custMName: values.middleName,
        custEmail: values.email,
        custPhone: values.contact,
        billAddr1: values.address1,
        billAddr2: values.address2,
        billCityTownVill: values.city,
        billDist: values.dist,
        billState: values.state,
        billPIN: values.pin,
        billCountry: values.country
      },
      Token: userState.user!.token
    }
    try {
      // THE API ANSWERS 200 EVEN ON FAILURE — `status` IS WHAT DECIDES, NOT THE HTTP CODE
      const response = await saveUserProfile(payload)

      if (!response?.status) {
        console.error("Failed to save profile", response)
        enqueueSnackbar(
          getApiErrorMessage(
            response?.data?.msg || response?.message,
            "Failed to save profile. Please try again."
          ),
          { variant: "error" }
        )
        return
      }

      // SAVED VALUES ARE NOW THE BASELINE, SO THE FORM GOES BACK TO PRISTINE
      reset(values)
      setSavedAddress1(values.address1)
      enqueueSnackbar("Profile saved successfully!", { variant: "success" })
    } catch (error) {
      console.error("Failed to save profile", error)
      const err = error as { response?: { data?: { message?: string } }; message?: string }
      enqueueSnackbar(
        getApiErrorMessage(
          err.response?.data?.message || err.message,
          "Failed to save profile. Please try again."
        ),
        { variant: "error" }
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      <FieldGroup>
        {/* IDENTITY STRIP — UPDATES LIVE AS THE NAME FIELDS ARE EDITED */}
        <SectionCard
          elevation={0}
          sx={{
            gap: 2,
            display: "flex",
            alignItems: "center",
            background: `linear-gradient(135deg, ${alpha(BRAND.primary, 0.08)} 0%, transparent 60%)`
          }}
        >
          <Avatar
            sx={{
              width: 60,
              height: 60,
              fontSize: 20,
              fontWeight: 700,
              flexShrink: 0,
              color: BRAND.primaryContrast,
              bgcolor: BRAND.primary
            }}
          >
            {initials}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography noWrap variant="h6" fontWeight={700}>
              {fullName || "Your profile"}
            </Typography>
            <Typography noWrap variant="body2" color="text.secondary">
              {email || "Add your contact details below"}
            </Typography>
          </Box>

          {isDirty && (
            <Chip
              size="small"
              color="warning"
              variant="outlined"
              label="Unsaved changes"
              sx={{ flexShrink: 0, display: { xs: "none", sm: "inline-flex" } }}
            />
          )}
        </SectionCard>

        {/* PERSONAL INFORMATION */}
        <SectionCard elevation={0}>
          <SectionHeader
            icon={<PersonOutline fontSize="small" />}
            title="Personal Information"
            caption="Your name and how we reach you about orders."
          />

          <Grid container spacing={2.5}>
            <Grid size={{ md: 4, xs: 12 }}>
              <TextField size="medium" fullWidth name="firstName" label="First Name" />
            </Grid>

            <Grid size={{ md: 4, xs: 12 }}>
              <TextField size="medium" fullWidth name="middleName" label="Middle Name" />
            </Grid>

            <Grid size={{ md: 4, xs: 12 }}>
              <TextField size="medium" fullWidth name="lastName" label="Last Name" />
            </Grid>

            <Grid size={{ md: 6, xs: 12 }}>
              <TextField size="medium" fullWidth name="email" type="email" label="Email" />
            </Grid>

            <Grid size={{ md: 6, xs: 12 }}>
              <TextField
                size="medium"
                fullWidth
                label="Phone"
                name="contact"
                slotProps={
                  user.custPhoneCode
                    ? {
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">{user.custPhoneCode}</InputAdornment>
                          )
                        }
                      }
                    : undefined
                }
              />
            </Grid>
          </Grid>
        </SectionCard>

        {/* BILLING ADDRESS */}
        <SectionCard elevation={0}>
          <SectionHeader
            icon={<LocationOnOutlined fontSize="small" />}
            title="Billing Address"
            caption="Start typing to pick your address — city, state and zip fill in automatically."
          />

          <Grid container spacing={2.5}>
            <Grid size={12}>
              <AddressAutocomplete
                key={addressKey}
                size="medium"
                label="Address"
                defaultValue={savedAddress1}
                onAddressSelect={handleAddressSelect}
                onTextChange={handleAddressTextChange}
                error={Boolean(errors.address1)}
                helperText={errors.address1?.message}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                size="medium"
                fullWidth
                label="Address line 2 (optional)"
                name="address2"
              />
            </Grid>

            <Grid size={{ md: 6, xs: 12 }}>
              <TextField size="medium" fullWidth label="City" name="city" />
            </Grid>

            <Grid size={{ md: 6, xs: 12 }}>
              <TextField size="medium" fullWidth label="District" name="dist" />
            </Grid>

            <Grid size={{ md: 4, xs: 12 }}>
              <TextField size="medium" fullWidth label="State" name="state" />
            </Grid>

            <Grid size={{ md: 4, xs: 12 }}>
              <TextField size="medium" fullWidth label="Zip" name="pin" />
            </Grid>

            <Grid size={{ md: 4, xs: 12 }}>
              <TextField size="medium" fullWidth label="Country" name="country" />
            </Grid>
          </Grid>
        </SectionCard>

        {/* ACTIONS */}
        <SectionCard elevation={0} sx={{ marginBottom: 0, ":hover": { boxShadow: "none" } }}>
          <FlexBetween gap={2} flexWrap="wrap">
            <Typography variant="body2" color={isDirty ? "warning.main" : "text.secondary"}>
              {isDirty ? "You have unsaved changes" : "Everything is up to date"}
            </Typography>

            <FlexBox gap={1.5} sx={{ marginLeft: "auto" }}>
              <Button
                size="large"
                color="inherit"
                variant="outlined"
                onClick={handleReset}
                disabled={!isDirty || isSaving}
              >
                Reset
              </Button>

              <Button
                disableElevation
                size="large"
                type="submit"
                variant="contained"
                loading={isSaving}
                disabled={!isDirty}
                sx={{
                  bgcolor: BRAND.primary,
                  transition: "background-color .2s ease, transform .2s ease, box-shadow .2s ease",
                  ":hover": {
                    bgcolor: BRAND.primaryDark,
                    transform: "translateY(-1px)",
                    boxShadow: `0 6px 16px ${alpha(BRAND.primary, 0.4)}`
                  }
                }}
              >
                Save Changes
              </Button>
            </FlexBox>
          </FlexBetween>
        </SectionCard>
      </FieldGroup>
    </FormProvider>
  )
}

// ==============================================================
type SectionHeaderProps = { icon: ReactNode; title: string; caption: string }
// ==============================================================

function SectionHeader({ icon, title, caption }: SectionHeaderProps) {
  return (
    <Box sx={{ marginBottom: 3 }}>
      <FlexBox gap={1.5} alignItems="center">
        <Avatar
          variant="rounded"
          sx={{
            width: 34,
            height: 34,
            color: BRAND.primary,
            bgcolor: alpha(BRAND.primary, 0.12)
          }}
        >
          {icon}
        </Avatar>

        <Box>
          <Typography variant="subtitle1" fontWeight={700} lineHeight={1.3}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {caption}
          </Typography>
        </Box>
      </FlexBox>

      <Divider sx={{ marginTop: 2 }} />
    </Box>
  )
}
