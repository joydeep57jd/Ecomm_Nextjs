"use client"

import { Fragment } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

// MUI
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
// GLOBAL CUSTOM COMPONENTS
import { TextField, FormProvider } from "components/form-hook"
import FlexRowCenter from "components/flex-box/flex-row-center"
// LOCAL CUSTOM COMPONENT
import BoxLink from "../components/box-link"
import { forgotPasswordSchema, ForgotPasswordSchemaType } from "@/schema/auth/forgotPassward.schema"
import { forgotPassword } from "@/utils/api/auth"
import { enqueueSnackbar } from "notistack"

export default function ResetPassword() {
  const methods = useForm<ForgotPasswordSchemaType>({
    defaultValues: { email: "" },
    resolver: yupResolver(forgotPasswordSchema)
  })

  const {
    handleSubmit,
    formState: { isSubmitting }
  } = methods

  const handleSubmitForm = handleSubmit(async (values) => {
    try {
      const res = await forgotPassword(values.email)
      if (res?.success) {
        enqueueSnackbar("Password reset link sent to your email.", { variant: "success" })
      } else {
        enqueueSnackbar(res?.message || "Something went wrong. Try again.", { variant: "error" })
      }
    } catch (err) {
      enqueueSnackbar( "Request failed. Please try again.", {
        variant: "error"
      })

      console.error("Forgot password error:",err )
    }
  })

  return (
    <Fragment>
      <Typography variant="h3" fontWeight={700} sx={{ mb: 4, textAlign: "center" }}>
        Reset your password
      </Typography>

      <FormProvider methods={methods} onSubmit={handleSubmitForm}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            name="email"
            type="email"
            label="Email"
            size="medium"
            placeholder="exmple@mail.com"
          />

          <Button
            fullWidth
            size="large"
            type="submit"
            color="primary"
            variant="contained"
            loading={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Reset"}
          </Button>
        </Stack>
      </FormProvider>

      <FlexRowCenter mt={3} justifyContent="center" gap={1}>
        <Typography variant="body1" color="text.secondary">
          Don&apos;t have an account?
        </Typography>

        <BoxLink title="Register" href="/register" />
      </FlexRowCenter>
    </Fragment>
  )
}
