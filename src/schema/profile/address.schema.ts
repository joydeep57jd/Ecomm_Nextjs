import * as yup from "yup"

export const validationSchema = yup.object({
  street2: yup.string().max(100, "Street2 must be at most 100 characters").optional(),

  fname: yup
    .string()
    .max(50, "First Name cannot exceed 50 characters")
    .required("First Name is required"),

  mname: yup.string().max(50, "Middle Name cannot exceed 50 characters").optional(),

  lname: yup
    .string()
    .max(50, "Last Name cannot exceed 50 characters")
    .required("Last Name is required"),

  email: yup.string().required("Email is required").email("Enter a valid email"),

  address1: yup.string().required("Street is required"),

  phone: yup
    .string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone is required"),

  city: yup.string().optional(),

  state: yup.string().optional(),

  country: yup.string().required("Country is required"),

  pin: yup
    .string()
    .matches(/^\d{6}$/, "Zip must be exactly 6 digits")
    .required("Zip is required")
})
