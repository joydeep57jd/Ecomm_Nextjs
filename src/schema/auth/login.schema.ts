import * as yup from "yup"

export const loginSchema = (alreadyCustomer: boolean) =>
  yup.object().shape({
    phoneNo: yup.string().required("Phone number is required"),
    password: alreadyCustomer
      ? yup.string().required("Password is required")
      : yup.string().default("").optional()
  })

export type LoginSchemaType = yup.InferType<ReturnType<typeof loginSchema>>
