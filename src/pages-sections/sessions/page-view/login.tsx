// "use client"

// import Button from "@mui/material/Button"
// import { useForm } from "react-hook-form"
// import { yupResolver } from "@hookform/resolvers/yup"
// import { useState } from "react"

// // GLOBAL CUSTOM COMPONENTS
// import { TextField, FormProvider } from "components/form-hook"
// // LOCAL CUSTOM COMPONENTS
// import Label from "../components/label"
// import EyeToggleButton from "../components/eye-toggle-button"
// // LOCAL CUSTOM HOOK
// import usePasswordVisible from "../use-password-visible"
// import { loginSchema, LoginSchemaType } from "@/schema/auth/login.schema"
// import { login, varifyCustomer } from "@/utils/api/auth"
// import { CustomerPayload, LoginRequest } from "@/models/Auth.model"
// import { useRouter } from "next/navigation"
// import { setItem } from "@/utils/services/local-storage.service"
// import { useUser } from "@/contexts/UserContenxt"
// import { getCart, getLocalCartFromRemoteCart } from "@/utils/api/cart"
// import useCart from "@/hooks/useCart"

// // LOGIN FORM FIELD VALIDATION SCHEMA

// export default function LoginPageView() {
//   const { visiblePassword, togglePasswordVisible } = usePasswordVisible()
//   const { setUser } = useUser()
//   const { state, dispatch } = useCart()
//   const [alreadyCustomer, setAlreadyCustomer] = useState<boolean>(false)
//   const [isApiCallInprogress, setisApiCallInprogress] = useState(false)

//   const router = useRouter()

//   const initialValues: LoginSchemaType = { phoneNo: "", password: "" }

//   const methods = useForm<LoginSchemaType>({
//     defaultValues: initialValues,
//     resolver: yupResolver(loginSchema(alreadyCustomer))
//   })

//   const { handleSubmit } = methods

//   const handleVerify = async (values: { phoneNo: string }) => {
//     try {
//       setisApiCallInprogress(true)
//       const payload: CustomerPayload = {
//         PhoneCode: "+91",
//         PhoneNo: values.phoneNo
//       }
//       const res = await varifyCustomer(payload)
//       setAlreadyCustomer(res.alreadyCustomer)
//     } catch (err) {
//       console.error("Verification failed", err)
//     } finally {
//       setisApiCallInprogress(false)
//     }
//   }

//   const handleLogin = async (values: LoginSchemaType) => {
//     try {
//       setisApiCallInprogress(true)
//       const payload: LoginRequest = {
//         UserName: values.phoneNo,
//         Password: values.password!
//       }
//       const data = await login(payload)
//       const remoteCarts = await getCart(+data.customerId)
//       const localCarts = state.cart || []
//       const finalCarts = getLocalCartFromRemoteCart(remoteCarts || [])
//       localCarts.forEach((cart) => {
//         const remoteCartIndex = finalCarts.findIndex(
//           (remoteCart) =>
//             remoteCart.itemVariantId === cart.itemVariantId &&
//             cart.productId === remoteCart.productId
//         )
//         if (remoteCartIndex !== -1) {
//           finalCarts[remoteCartIndex].qty = finalCarts[remoteCartIndex].qty + cart.qty
//         } else {
//           finalCarts.push(cart)
//         }
//       })

//       dispatch({
//         type: "SET_CART",
//         carts: finalCarts,
//         isLoggedIn: true,
//         isSyncRequired: true,
//         user: data,
//         remoteCarts: remoteCarts || []
//       })

//       setItem("userDetails", data)
//       setUser(data)

//       router.back()
//     } catch (err) {
//       console.error("Login failed", err)
//     } finally {
//       setisApiCallInprogress(false)
//     }
//   }

//   const handleSubmitForm = handleSubmit((values: LoginSchemaType) => {
//     !alreadyCustomer ? handleVerify(values) : handleLogin(values)
//   })

//   return (
//     <FormProvider methods={methods} onSubmit={handleSubmitForm}>
//       <div className="mb-1">
//         <Label>Phone Number</Label>
//         <TextField fullWidth name="phoneNo" type="number" size="medium" placeholder="1234567890" />
//       </div>

//       {alreadyCustomer && (
//         <div className="mb-2">
//           <Label>Password</Label>
//           <TextField
//             fullWidth
//             size="medium"
//             name="password"
//             autoComplete="on"
//             placeholder="*********"
//             type={visiblePassword ? "text" : "password"}
//             slotProps={{
//               input: {
//                 endAdornment: (
//                   <EyeToggleButton show={visiblePassword} click={togglePasswordVisible} />
//                 )
//               }
//             }}
//           />
//         </div>
//       )}

//       {/* <Box display={"flex"} gap={1}>
//         <Button
//         fullWidth
//         size="large"
//         type="submit"
//         color="primary"
//         variant="contained"
//         loading={isApiCallInprogress}
//       >
//         {alreadyCustomer ? "Login" : "Login with password"}
//       </Button>
//         <Button
//         fullWidth
//         size="large"
//         type="submit"
//         color="primary"
//         variant="outlined"
//         loading={isApiCallInprogress}
//       >
//         {alreadyCustomer ? "Login" : "Login with OTP"}
//       </Button>

//       </Box> */}

//         <Button
//         fullWidth
//         size="large"
//         type="submit"
//         color="primary"
//         variant="outlined"
//         loading={isApiCallInprogress}
//       >
//         {alreadyCustomer ? "Login" : "Verify"}
//       </Button>

//     </FormProvider>
//   )
// }

"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Box, Button, Radio, RadioGroup, FormControlLabel } from "@mui/material"

// GLOBAL CUSTOM COMPONENTS
import { TextField, FormProvider } from "components/form-hook"
// LOCAL CUSTOM COMPONENTS
import Label from "../components/label"
import EyeToggleButton from "../components/eye-toggle-button"
// LOCAL CUSTOM HOOK
import usePasswordVisible from "../use-password-visible"

// SCHEMA & API
import { loginSchema, LoginSchemaType, LoginSchemaTypey } from "@/schema/auth/login.schema"
import { login, varifyCustomer, loginWithOTP } from "@/utils/api/auth"
import { CustomerPayload, LoginRequest, OTPCredentials } from "@/models/Auth.model"
import { useRouter } from "next/navigation"
import { setItem } from "@/utils/services/local-storage.service"
import { useUser } from "@/contexts/UserContenxt"
import { getCart, getLocalCartFromRemoteCart } from "@/utils/api/cart"
import useCart from "@/hooks/useCart"

export default function LoginPageView() {
  const { visiblePassword, togglePasswordVisible } = usePasswordVisible()
  const { setUser } = useUser()
  const { state, dispatch } = useCart()
  const [alreadyCustomer, setAlreadyCustomer] = useState<boolean>(false)
  const [isApiCallInprogress, setisApiCallInprogress] = useState(false)
  const [loginType, setLoginType] = useState<"password" | "otp">("password")

  const router = useRouter()

  const initialValues: LoginSchemaType = { phoneNo: "", password: "" }

  const methods = useForm<LoginSchemaType>({
    defaultValues: initialValues,
    resolver: yupResolver(loginSchema(alreadyCustomer))
  })

  const { handleSubmit } = methods

  const handleVerify = async (values: { phoneNo: string }) => {
    try {
      setisApiCallInprogress(true)
      const payload: CustomerPayload = {
        PhoneCode: "+91",
        PhoneNo: values.phoneNo
      }
      const res = await varifyCustomer(payload)
      setAlreadyCustomer(res.alreadyCustomer)
    } catch (err) {
      console.error("Verification failed", err)
    } finally {
      setisApiCallInprogress(false)
    }
  }

  const handleLogin = async (values: LoginSchemaType) => {
    try {
      setisApiCallInprogress(true)
      const payload: LoginRequest = {
        UserName: values.phoneNo,
        Password: values.password!
      }
      const data = await login(payload)

      const remoteCarts = await getCart(+data.customerId)
      const localCarts = state.cart || []
      const finalCarts = getLocalCartFromRemoteCart(remoteCarts || [])

      localCarts.forEach((cart) => {
        const remoteCartIndex = finalCarts.findIndex(
          (remoteCart) =>
            remoteCart.itemVariantId === cart.itemVariantId &&
            cart.productId === remoteCart.productId
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

      router.back()
    } catch (err) {
      console.error("Login failed", err)
    } finally {
      setisApiCallInprogress(false)
    }
  }

  const handleLoginOTP = async (values: LoginSchemaTypey) => {
    try {
      const payload: OTPCredentials = {
        PhoneCode: "+91",
        PhoneNo: values.PhoneNo,
        otp: values.otp
      }
      const data = await loginWithOTP(payload)

      const remoteCarts = await getCart(+data.customerId)
      const localCarts = state.cart || []
      const finalCarts = getLocalCartFromRemoteCart(remoteCarts || [])

      localCarts.forEach((cart) => {
        const remoteCartIndex = finalCarts.findIndex(
          (remoteCart) =>
            remoteCart.itemVariantId === cart.itemVariantId &&
            cart.productId === remoteCart.productId
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

      router.back()
    } catch (err) {
      console.error("Login failed", err)
    } finally {
      setisApiCallInprogress(false)
    }
  }

  const handleSubmitForm = handleSubmit((values: LoginSchemaType) => {
    !alreadyCustomer ? handleVerify(values) : handleLogin(values)
  })

  return (
    <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      <div className="mb-1">
        <Label>Phone Number</Label>
        <TextField fullWidth name="phoneNo" type="number" size="medium" placeholder="1234567890" />
      </div>

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

      {alreadyCustomer && loginType === "password" && (
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
      )}

      {loginType === "otp" && alreadyCustomer && (
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

      <Box display="flex" gap={1}>
        <Button
          fullWidth
          size="large"
          type="submit"
          color="primary"
          variant="contained"
          disabled={isApiCallInprogress}
        >
          {alreadyCustomer ? (loginType === "password" ? "Login" : "Send OTP") : "Continue"}
        </Button>
      </Box>
    </FormProvider>
  )
}
