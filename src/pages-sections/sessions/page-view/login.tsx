"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Box, Button, Radio, RadioGroup, FormControlLabel, CircularProgress } from "@mui/material"
import ReCAPTCHA from "react-google-recaptcha"

import { TextField, FormProvider } from "components/form-hook"
import Label from "../components/label"
import EyeToggleButton from "../components/eye-toggle-button"
import usePasswordVisible from "../use-password-visible"

// SCHEMA & API
import { loginSchema, LoginSchemaType } from "@/schema/auth/login.schema"
import { loginWithCredentials, varifyCustomer, loginWithOTP } from "@/utils/api/auth"
import {
  CustomerPayload,
  LoginWithCredentialsRequest,
  LoginWithOTPRequest,
  UserData
} from "@/models/Auth.model"
import { useRouter } from "next/navigation"
import { setItem } from "@/utils/services/local-storage.service"
import { useUser } from "@/contexts/UserContenxt"
import { getCart, getLocalCartFromRemoteCart } from "@/utils/api/cart"
import useCart from "@/hooks/useCart"
import { useSnackbar } from "notistack"

const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY 

export default function LoginPageView() {
  const otpLoginEnabled = process.env.NEXT_PUBLIC_OTP_LOGIN_ENABLED === "true"
  const { visiblePassword, togglePasswordVisible } = usePasswordVisible()
  const { setUser } = useUser()
  const { state, dispatch } = useCart()
  const [isInitialStep, setIsInitialStep] = useState<boolean>(true)
  const [isApiCallInprogress, setisApiCallInprogress] = useState(false)
  const [loginType, setLoginType] = useState<"password" | "otp">("password")
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)

  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  const initialValues: LoginSchemaType = { phoneNo: "", password: "", otp: "" }

  const methods = useForm<LoginSchemaType>({
    defaultValues: initialValues,
    resolver: yupResolver(loginSchema(isInitialStep, loginType === "otp"))
  })

  const { handleSubmit } = methods

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token)
  }

  const handleVerify = async (values: LoginSchemaType) => {
    try {
      setisApiCallInprogress(true)
      const payload: CustomerPayload = {
        PhoneCode: "+91",
        PhoneNo: values.phoneNo
      }
      const data = await varifyCustomer(payload)
      if (data.alreadyCustomer) {
        setRecaptchaToken(null) // reset recaptcha
        setIsInitialStep(false)
        enqueueSnackbar("User verified. Please proceed to login.", { variant: "success" })
      } else {
        enqueueSnackbar("You are not a registered user. Please sign up first.", {
          variant: "error"
        })
      }
    } catch (err) {
      enqueueSnackbar("Verification failed. Please check the phone number.", { variant: "error" })
      console.error("Verification failed", err)
    } finally {
      setisApiCallInprogress(false)
    }
  }

  const handleSendOTP = async (values: LoginSchemaType) => {
    try {
      setisApiCallInprogress(true)
      const payload = {
        PhoneCode: "+91",
        PhoneNo: values.phoneNo
      }
      console.warn("payload", payload)
      enqueueSnackbar("OTP sent successfully.", { variant: "success" })
      setRecaptchaToken(null) // reset recaptcha
      setIsInitialStep(false)
    } catch (err) {
      console.error("Sending OTP failed", err)
      enqueueSnackbar("Failed to send OTP. Please try again.", { variant: "error" })
    } finally {
      setisApiCallInprogress(false)
    }
  }

  const postLoginCartSync = async (data: UserData) => {
    const remoteCarts = await getCart(+data.customerId)
    const localCarts = state.cart || []
    const finalCarts = getLocalCartFromRemoteCart(remoteCarts || [])

    localCarts.forEach((cart) => {
      const remoteCartIndex = finalCarts.findIndex(
        (remoteCart) =>
          remoteCart.itemVariantId === cart.itemVariantId && cart.productId === remoteCart.productId
      )
      if (remoteCartIndex !== -1) {
        finalCarts[remoteCartIndex].qty += cart.qty
      } else {
        finalCarts.push(cart)
      }
    })

    dispatch({
      type: "SET_CART",
      carts: finalCarts,
      isLoggedIn: true,
      isSyncRequired: true,
      user: data,
      remoteCarts: remoteCarts || []
    })

    setItem("userDetails", data)
    setUser(data)
    enqueueSnackbar("Logged In Successfully!!!", { variant: "success" })

    const prevPath = localStorage.getItem("prevPath")
    localStorage.removeItem("prevPath")

    if (prevPath === "/register") {
      router.replace("/")
    } else {
      router.back()
    }
  }

  const handleLoginWithCredentials = async (values: LoginSchemaType) => {
    if (!recaptchaToken) {
      enqueueSnackbar("Please verify the reCAPTCHA first", { variant: "warning" })
      return
    }

    try {
      setisApiCallInprogress(true)
      const payload: LoginWithCredentialsRequest = {
        UserName: values.phoneNo,
        Password: values.password!
      }
      const data = await loginWithCredentials(payload)
      if (data) {
        postLoginCartSync(data)
      } else {
        enqueueSnackbar("Login failed. Please check your credentials.", { variant: "error" })
      }
    } catch (err) {
      enqueueSnackbar("Login failed. Please check your credentials.", { variant: "error" })
      console.error("Login failed", err)
    } finally {
      setisApiCallInprogress(false)
    }
  }

  const handleLoginWithOTP = async (values: LoginSchemaType) => {
    if (!recaptchaToken) {
      enqueueSnackbar("Please verify the reCAPTCHA first", { variant: "warning" })
      return
    }

    try {
      const payload: LoginWithOTPRequest = {
        PhoneCode: "+91",
        PhoneNo: values.phoneNo,
        otp: values.otp
      }
      const data = await loginWithOTP(payload)
      postLoginCartSync(data)
    } catch (err) {
      enqueueSnackbar("OTP verification failed. Please try again.", { variant: "error" })
      console.error("Login failed", err)
    } finally {
      setisApiCallInprogress(false)
    }
  }

  const handleSubmitForm = handleSubmit((values: LoginSchemaType) => {
    isInitialStep ? handleFirstSubmit(values) : handleSecondSubmit(values)
  })

  const handleFirstSubmit = (values: LoginSchemaType) => {
    loginType === "password" ? handleVerify(values) : handleSendOTP(values)
  }

  const handleSecondSubmit = (values: LoginSchemaType) => {
    loginType === "password" ? handleLoginWithCredentials(values) : handleLoginWithOTP(values)
  }

  const handleChangeNumber = () => {
    setIsInitialStep(true)
    setLoginType("password")
    methods.reset()
    setRecaptchaToken(null)
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      {isInitialStep ? (
        <>
          
          <div className="mb-1">
            <Label>Phone Number</Label>
            <TextField
              disabled={!isInitialStep}
              fullWidth
              name="phoneNo"
              type="number"
              size="medium"
              placeholder="1234567890"
            />
          </div>

          {otpLoginEnabled && (
            <Box mb={2}>
              <RadioGroup
                row
                value={loginType}
                onChange={(e) => setLoginType(e.target.value as "password" | "otp")}
              >
                <FormControlLabel
                  value="password"
                  control={<Radio color="primary" />}
                  label="Login with Password"
                />
                <FormControlLabel
                  value="otp"
                  control={<Radio color="primary" />}
                  label="Login with OTP"
                />
              </RadioGroup>
            </Box>
          )}
        </>
      ) : (
        <>
          
          <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              Not you? <strong>{methods.getValues("phoneNo")}</strong>
            </Box>
            <Button variant="text" onClick={handleChangeNumber} size="small">
              Change
            </Button>
          </Box>

          {loginType === "password" ? (
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
                    endAdornment: (
                      <EyeToggleButton show={visiblePassword} click={togglePasswordVisible} />
                    )
                  }
                }}
              />
            </div>
          ) : (
            <div className="mb-2">
              <Label>Enter OTP</Label>
              <TextField
                fullWidth
                size="medium"
                name="otp"
                type="number"
                placeholder="Enter 6-digit OTP"
                inputProps={{ maxLength: 6 }}
              />
            </div>
          )}

        
          <Box my={2} display="flex" justifyContent="first">
            {RECAPTCHA_SITE_KEY ? (
              <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={handleRecaptchaChange} />
            ) : null}
          </Box>
        </>
      )}

     
      <Box display="flex" gap={1}>
        <Button
          fullWidth
          size="large"
          type="submit"
          color="primary"
          variant="contained"
          disabled={
            isApiCallInprogress ||
            (!isInitialStep && !recaptchaToken) 
          }
          sx={{
            gap: 1,
            opacity: !isInitialStep && !recaptchaToken ? 0.7 : 1,
            cursor: !isInitialStep && !recaptchaToken ? "not-allowed" : "pointer"
          }}
        >
          {isApiCallInprogress ? (
            <CircularProgress size={20} />
          ) : (
            <>
              {isInitialStep
                ? "Continue"
                : loginType === "password"
                ? "Login"
                : "Send OTP"}
            </>
          )}
        </Button>
      </Box>
    </FormProvider>
  )
}
