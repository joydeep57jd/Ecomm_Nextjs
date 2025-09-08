import * as yup from "yup"

export const registerSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  middleName: yup.string().default(""),
  lastName: yup.string().required("Last Name is required"),
  phoneNumber: yup
    .string()
    .required("Mobile Number is required")
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit number"),
  email: yup.string().email("Invalid Email Address").required("Email is required"),
  password: yup.string().required("Password is required"),
  re_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please re-type password"),
  agreement: yup
    .bool()
    .test(
      "agreement",
      "You have to agree with our Terms and Conditions!",
      (value) => value === true
    )
    .required("You have to agree with our Terms and Conditions!"),
  countryCode: yup.string().default("+91"),
  country: yup.string().default("")
})

export type RegisterSchemaType = yup.InferType<typeof registerSchema>

export const registerSchemaInitialValues: RegisterSchemaType = {
  firstName: "",
  middleName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  password: "",
  re_password: "",
  agreement: false,
  countryCode: "+91",
  country: ""
}
