import * as yup from "yup"

export const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("Email is required")
})

export type ForgotPasswordSchemaType = yup.InferType<typeof forgotPasswordSchema>
