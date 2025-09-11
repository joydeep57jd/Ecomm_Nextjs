import * as yup from "yup"


export const  validationSchema = yup.object().shape({
  phoneCode: yup.string().required("Phone code is required"),
  phoneNo: yup.string().required("Phone number is required"),
  password: yup.string().required("Password is required")
})