import * as yup from "yup"

export const loginSchema = (isInitialStep: boolean, isOtpLogin: boolean) =>
  yup.object().shape({
    phoneNo: yup.string().required("Phone number is required"),
    password:
      !isInitialStep && !isOtpLogin
        ? yup.string().required("Password is required")
        : yup.string().default("").optional(),
    otp:
      !isInitialStep && isOtpLogin
        ? yup.string().required("OTP is required")
        : yup.string().default("").optional()
  })

export type LoginSchemaType = yup.InferType<ReturnType<typeof loginSchema>>
