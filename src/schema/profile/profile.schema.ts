import { UserProfile } from "@/models/User.model"
import * as yup from "yup"

export const profileSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  middleName: yup.string().default("").optional(),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("invalid email").required("Email is required"),
  contact: yup
    .string()
    .required("Contact is required")
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number"),
  address1: yup.string().required("Address is required"),
  address2: yup.string().default("").optional(),
  city: yup.string().required("City is required"),
  dist: yup.string().default("").optional(),
  state: yup.string().required("State is required"),
  pin: yup
    .string()
    .required("Zip is required")
    .matches(/^[0-9]{6}$/, "Zip must be exactly 6 digits"),
  country: yup.string().required("Country is required")
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
    middleName: user.custMName || "",
    // BILLING ADDRESS — SAME FIELDS THE PROFILE PAYLOAD SENDS BACK
    address1: user.billAddr1 || "",
    address2: user.billAddr2 || "",
    city: user.billCityTownVill || "",
    dist: user.billDist || "",
    state: user.billState || "",
    pin: user.billPIN || "",
    country: user.billCountry || ""
  }
}
