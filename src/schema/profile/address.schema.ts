import * as yup from "yup"

export const  validationSchema = yup.object({
  street2: yup.string().optional(),
  fname: yup.string().required("First Name is required"),
  mname:yup.string().optional(),
  lname: yup.string().required("Last Name is required"),
  email: yup.string().required("Email is required").email("Enter a valid email"),
  address1: yup.string().required("Street is required"),
  phone: yup.string().required("Phone is required"),
  city: yup.string().optional(),
  state: yup.string().optional(),
  country: yup.string().required("Country is required"),
  pin: yup.string().required("Zip is required")
})