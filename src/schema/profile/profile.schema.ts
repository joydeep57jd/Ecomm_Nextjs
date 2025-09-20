import { UserProfile } from "@/models/User.model"
import * as yup from "yup"

export const profileSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  middleName: yup.string().default("").optional(),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("invalid email").required("Email is required"),
  contact: yup.string().required("Contact is required")
})

export type ProfileSchemaType = yup.InferType<typeof profileSchema>

export const getProfileInitialValue = (user: UserProfile) => {
  const code = user.custPhoneCode || ""
  const custPhone = user.custPhone
  const codePhoneNumber = custPhone.split(code)
  const contact = code ? codePhoneNumber[1] || "" : custPhone
  return {
    email: user.custEmail || "",
    contact: contact,
    lastName: user.custLName || "",
    firstName: user.custFName || "",
    middleName: user.custMName || ""
  }
}
