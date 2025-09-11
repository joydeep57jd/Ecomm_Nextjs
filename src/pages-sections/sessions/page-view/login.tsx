"use client"

import Button from "@mui/material/Button"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import {   useState } from "react"

// GLOBAL CUSTOM COMPONENTS
import { TextField, FormProvider } from "components/form-hook"
// LOCAL CUSTOM COMPONENTS
import Label from "../components/label"
import EyeToggleButton from "../components/eye-toggle-button"
// LOCAL CUSTOM HOOK
import usePasswordVisible from "../use-password-visible"
import { validationSchema } from "@/schema/auth/login.schema"
import { login, varifyCustomer } from "@/utils/api/auth"
import { CustomerPayload, LoginRequest, LoginResponse } from "@/models/Auth.model"


// LOGIN FORM FIELD VALIDATION SCHEMA


export default function LoginPageView() {
  
 
  
  const { visiblePassword, togglePasswordVisible } = usePasswordVisible()
  const [alreadyCustomer, setAlreadyCustomer] = useState<boolean | null>(null)

  const initialValues = { phoneNo: "", password: "" }

  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema)
  })

  const {
    handleSubmit,
    formState: { isSubmitting }
  } = methods

   const handleVerify = async (values: { phoneNo: string }) => {
    try {
      const payload: CustomerPayload = {
        PhoneCode: "+91", 
        PhoneNo: values.phoneNo,
      }

      const res = await varifyCustomer(payload)
      setAlreadyCustomer(res.alreadyCustomer)
    } catch (err) {
      console.error("Verification failed", err)
    }
  }

   const handleLogin = async (values: { phoneNo: string; password: string }) => {
    try {
      const payload: LoginRequest = {
        UserName: values.phoneNo, 
        Password: values.password,
      }

      const res: LoginResponse = await login(payload)
      console.warn("Login success:", res)
    } catch (err) {
      console.error("Login failed", err)
    }
  }


    const handleSubmitForm = handleSubmit((values) => {
    if (alreadyCustomer === null) {
      handleVerify(values)
    } else if (alreadyCustomer) {
      handleLogin(values)

    } else {
      alert("New customer, redirect to signup flow")
      

    }
  })

  return (
    <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      <div className="mb-1">
        <Label>Phone Number</Label>
        <TextField
          fullWidth
          name="phoneNo"
          
          type="number"
          size="medium"
          placeholder="1234567890"
        />
      </div>

      <div className="mb-2">
        <Label>Password</Label>
        <TextField
          fullWidth
          size="medium"
          name="password"
          autoComplete="on"
          placeholder="*********"
          type={visiblePassword ? "text" : "password"}
          slotProps={{
            input: {
              endAdornment: <EyeToggleButton show={visiblePassword} click={togglePasswordVisible} />
            }
          }}
        />
      </div>

      <Button
        fullWidth
        size="large"
        type="submit"
        color="primary"
        variant="contained"
        loading={isSubmitting}
      >
        Login
      </Button>
    </FormProvider>
  )
}
