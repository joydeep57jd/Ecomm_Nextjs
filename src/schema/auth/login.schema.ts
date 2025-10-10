import * as yup from "yup"

export const loginSchema = (alreadyCustomer: boolean) =>
  yup.object().shape({
    phoneNo: yup.string().required("Phone number is required"),
    password: alreadyCustomer
      ? yup.string().required("Password is required")
      : yup.string().default("").optional()
  })

export type LoginSchemaType = yup.InferType<ReturnType<typeof loginSchema>>

export const LoginOTPSchema = yup.object().shape({
  PhoneNo: yup.string().required("Phone code is required"),

  otp: yup.string().required("OTP is required")
})

export type LoginSchemaTypey = yup.InferType<typeof LoginOTPSchema>