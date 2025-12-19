"use client"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useRouter } from "next/navigation"
import { useSnackbar } from "notistack"
import { signup } from "utils/api/auth"

// GLOBAL CUSTOM COMPONENTS
import { Checkbox, TextField, FormProvider } from "components/form-hook"
import FlexBox from "components/flex-box/flex-box"

// LOCAL COMPONENTS
import EyeToggleButton from "../components/eye-toggle-button"
import Label from "../components/label"
import BoxLink from "../components/box-link"
import usePasswordVisible from "../use-password-visible"
import { SignupData } from "@/models/Auth.model"
import {
  registerSchema,
  registerSchemaInitialValues,
  RegisterSchemaType
} from "@/schema/auth/register.schema"

export default function RegisterPageView() {
  const passwordVisibility = usePasswordVisible()
  const confirmPasswordVisibility = usePasswordVisible()


  const inputProps = {
    passwordEndAdornment: <EyeToggleButton show={passwordVisibility.visiblePassword} click={passwordVisibility.togglePasswordVisible} />,
    confirmPasswordEndAdornment: <EyeToggleButton show={confirmPasswordVisibility.visiblePassword} click={confirmPasswordVisibility.togglePasswordVisible} />
  }

  const methods = useForm({
    defaultValues: registerSchemaInitialValues,
    resolver: yupResolver(registerSchema)
  })

  const {
    handleSubmit,
    formState: { isSubmitting }
  } = methods

  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  const handleSubmitForm = handleSubmit(async (values: RegisterSchemaType) => {
    try {
      const payload: SignupData = {
        ...values,
        phone: `${values.phoneNumber}`
      }
      await signup(payload)
      enqueueSnackbar("Registration successful! Please login.", { variant: "success" })
       localStorage.setItem('prevPath', '/register')
      router.push("/login")
    } catch (error) {
      console.error("Error during registration:", error)
      const err = error as { response?: { data?: { message?: string } }; message?: string }
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again."
      enqueueSnackbar(errorMessage, { variant: "error" })
    }
  })

  return (
    <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      <div className="mb-1">
        <Label>First Name *</Label>
        <TextField fullWidth name="firstName" size="medium" placeholder="John" />
      </div>

      <div className="mb-1">
        <Label>Middle Name</Label>
        <TextField fullWidth name="middleName" size="medium" placeholder="Optional" />
      </div>

      <div className="mb-1">
        <Label>Last Name *</Label>
        <TextField fullWidth name="lastName" size="medium" placeholder="Doe" />
      </div>

      <div className="mb-1">
        <Label>Mobile No *</Label>
        <FlexBox gap={1}>
          {/* Country Code Dropdown */}

          <TextField
            fullWidth
            name="phoneNumber"
            size="medium"
            placeholder="9876543210"
            type="tel"
          />
        </FlexBox>
      </div>

      <div className="mb-1">
        <Label>Email Address *</Label>
        <TextField
          fullWidth
          name="email"
          size="medium"
          type="email"
          placeholder="example@mail.com"
        />
      </div>

      <div className="mb-1">
        <Label>Country</Label>
        <TextField fullWidth name="country" size="medium" placeholder="India" />
      </div>

      <div className="mb-1">
        <Label>Password *</Label>
        <TextField
          fullWidth
          size="medium"
          name="password"
          placeholder="*********"
          type={passwordVisibility.visiblePassword ? "text" : "password"}
          slotProps={{
            input: {
              endAdornment: inputProps.passwordEndAdornment
            }
          }}
        />
      </div>

      <div className="mb-1">
        <Label>Retype Password *</Label>
        <TextField
          fullWidth
          size="medium"
          name="re_password"
          placeholder="*********"
          type={confirmPasswordVisibility.visiblePassword ? "text" : "password"}
          slotProps={{
            input: {
              endAdornment: inputProps.confirmPasswordEndAdornment
            }
          }}
        />
      </div>

      <div className="agreement">
        <Checkbox
          name="agreement"
          size="small"
          color="secondary"
          label={
            <FlexBox flexWrap="wrap" alignItems="center" justifyContent="flex-start" gap={1}>
              <Box display={{ sm: "inline-block", xs: "none" }}>By signing up, you agree to</Box>
              <Box display={{ sm: "none", xs: "inline-block" }}>Accept Our</Box>
              <BoxLink title="Terms & Condition" href="/" />
            </FlexBox>
          }
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
        Create an Account
      </Button>
    </FormProvider>
  )
}


// "use client"

// import Box from "@mui/material/Box"
// import Button from "@mui/material/Button"
// import { useForm } from "react-hook-form"
// import { yupResolver } from "@hookform/resolvers/yup"
// import { useRouter } from "next/navigation"
// import { useSnackbar } from "notistack"
// import { signup } from "utils/api/auth"
// import { loginWithCredentials } from "@/utils/api/auth"
// import { setItem } from "@/utils/services/local-storage.service"
// import { useUser } from "@/contexts/UserContenxt"
// import useCart from "@/hooks/useCart"
// import { getCart, getLocalCartFromRemoteCart } from "@/utils/api/cart"

// // GLOBAL CUSTOM COMPONENTS
// import { Checkbox, TextField, FormProvider } from "components/form-hook"
// import FlexBox from "components/flex-box/flex-box"

// // LOCAL COMPONENTS
// import EyeToggleButton from "../components/eye-toggle-button"
// import Label from "../components/label"
// import BoxLink from "../components/box-link"
// import usePasswordVisible from "../use-password-visible"
// import { SignupData } from "@/models/Auth.model"
// import {
//   registerSchema,
//   registerSchemaInitialValues,
//   RegisterSchemaType
// } from "@/schema/auth/register.schema"

// export default function RegisterPageView() {
//   const passwordVisibility = usePasswordVisible()
//   const confirmPasswordVisibility = usePasswordVisible()

//   const inputProps = {
//     passwordEndAdornment: (
//       <EyeToggleButton
//         show={passwordVisibility.visiblePassword}
//         click={passwordVisibility.togglePasswordVisible}
//       />
//     ),
//     confirmPasswordEndAdornment: (
//       <EyeToggleButton
//         show={confirmPasswordVisibility.visiblePassword}
//         click={confirmPasswordVisibility.togglePasswordVisible}
//       />
//     )
//   }

//   const methods = useForm({
//     defaultValues: registerSchemaInitialValues,
//     resolver: yupResolver(registerSchema)
//   })

//   const {
//     handleSubmit,
//     formState: { isSubmitting }
//   } = methods

//   const router = useRouter()
//   const { enqueueSnackbar } = useSnackbar()
//   const { setUser } = useUser()
//   const { state, dispatch } = useCart()

//   const handleSubmitForm = handleSubmit(async (values) => {
//     try {
      
//       await signup({
//         ...values,
//         phone: `${values.phoneNumber}`
//       })

      
//       const loginPayload = {
//         UserName: values.phoneNumber,
//         Password: values.password
//       }

//       const userData = await loginWithCredentials(loginPayload)

      
//       const remoteCarts = await getCart(+userData.customerId)
//       const localCarts = state.cart || []
//       const finalCarts = getLocalCartFromRemoteCart(remoteCarts || [])

//       localCarts.forEach((cart) => {
//         const index = finalCarts.findIndex(
//           (r) => r.itemVariantId === cart.itemVariantId && r.productId === cart.productId
//         )

//         if (index !== -1) {
//           finalCarts[index].qty += cart.qty
//         } else {
//           finalCarts.push(cart)
//         }
//       })

//       dispatch({
//         type: "SET_CART",
//         carts: finalCarts,
//         isLoggedIn: true,
//         isSyncRequired: true,
//         user: userData,
//         remoteCarts: remoteCarts || []
//       })

      
//       setItem("userDetails", userData)
//       setUser(userData)

      
//       sessionStorage.setItem("REGISTER_AUTO_LOGIN", "true")

//       enqueueSnackbar("Account created & logged in successfully ", {
//         variant: "success"
//       })

      
//       router.replace("/")
//     } catch (error) {
//       console.error("Register/Login failed", error)

//       enqueueSnackbar("Registration successful but login failed. Please login manually.", {
//         variant: "error"
//       })
//     }
//   })

//   return (
//     <FormProvider methods={methods} onSubmit={handleSubmitForm}>
//       <div className="mb-1">
//         <Label>First Name *</Label>
//         <TextField fullWidth name="firstName" size="medium" placeholder="John" />
//       </div>

//       <div className="mb-1">
//         <Label>Middle Name</Label>
//         <TextField fullWidth name="middleName" size="medium" placeholder="Optional" />
//       </div>

//       <div className="mb-1">
//         <Label>Last Name *</Label>
//         <TextField fullWidth name="lastName" size="medium" placeholder="Doe" />
//       </div>

//       <div className="mb-1">
//         <Label>Mobile No *</Label>
//         <FlexBox gap={1}>
//           {/* Country Code Dropdown */}

//           <TextField
//             fullWidth
//             name="phoneNumber"
//             size="medium"
//             placeholder="9876543210"
//             type="tel"
//           />
//         </FlexBox>
//       </div>

//       <div className="mb-1">
//         <Label>Email Address *</Label>
//         <TextField
//           fullWidth
//           name="email"
//           size="medium"
//           type="email"
//           placeholder="example@mail.com"
//         />
//       </div>

//       <div className="mb-1">
//         <Label>Country</Label>
//         <TextField fullWidth name="country" size="medium" placeholder="India" />
//       </div>

//       <div className="mb-1">
//         <Label>Password *</Label>
//         <TextField
//           fullWidth
//           size="medium"
//           name="password"
//           placeholder="*********"
//           type={passwordVisibility.visiblePassword ? "text" : "password"}
//           slotProps={{
//             input: {
//               endAdornment: inputProps.passwordEndAdornment
//             }
//           }}
//         />
//       </div>

//       <div className="mb-1">
//         <Label>Retype Password *</Label>
//         <TextField
//           fullWidth
//           size="medium"
//           name="re_password"
//           placeholder="*********"
//           type={confirmPasswordVisibility.visiblePassword ? "text" : "password"}
//           slotProps={{
//             input: {
//               endAdornment: inputProps.confirmPasswordEndAdornment
//             }
//           }}
//         />
//       </div>

//       <div className="agreement">
//         <Checkbox
//           name="agreement"
//           size="small"
//           color="secondary"
//           label={
//             <FlexBox flexWrap="wrap" alignItems="center" justifyContent="flex-start" gap={1}>
//               <Box display={{ sm: "inline-block", xs: "none" }}>By signing up, you agree to</Box>
//               <Box display={{ sm: "none", xs: "inline-block" }}>Accept Our</Box>
//               <BoxLink title="Terms & Condition" href="/" />
//             </FlexBox>
//           }
//         />
//       </div>

//       <Button
//         fullWidth
//         size="large"
//         type="submit"
//         color="primary"
//         variant="contained"
//         loading={isSubmitting}
//       >
//         Create an Account
//       </Button>
//     </FormProvider>
//   )
// }

