import axios from "../axiosInstance"
import { API_URL } from "../constants"
import{ LoginCredentials, OTPCredentials, SignupData, ForgotPasswordData } from "../../models/Auth.model"



export const login = async (credentials: LoginCredentials) => {
  const response = await axios.post(API_URL.AUTH.LOGIN, credentials)
  return response.data
}

export const loginWithOTP = async (credentials: OTPCredentials) => {
  const response = await axios.post(API_URL.AUTH.SEND_OTP_FOR_LOGIN, credentials)
  return response.data
}

export const signup = async (data: SignupData) => {
  const response = await axios.post(API_URL.AUTH.SIGN_UP, data)
  return response.data
}

export const loginWithSocial = async (token: string, provider: string) => {
  const response = await axios.post(API_URL.AUTH.SIGNIN_BY_OTHERS, { token, provider })
  return response.data
}

export const forgotPassword = async (email: string) => {
  const response = await axios.post(API_URL.AUTH.FORGOT_PASSWORD, { email })
  return response.data
}

export const sendForgotPasswordOTP = async (email: string) => {
  const response = await axios.post(API_URL.AUTH.SEND_FORGOT_PASSWORD_OTP, { email })
  return response.data
}

export const verifyForgotPasswordOTP = async (email: string, otp: string) => {
  const response = await axios.post(API_URL.AUTH.VERIFY_FORGOT_PASSWORD_OTP, { email, otp })
  return response.data
}

export const changePassword = async (data: ForgotPasswordData) => {
  const response = await axios.post(API_URL.AUTH.CHANGE_PASSWORD, data)
  return response.data
}

export default {
  login,
  loginWithOTP,
  signup,
  loginWithSocial,
  forgotPassword,
  sendForgotPasswordOTP,
  verifyForgotPasswordOTP,
  changePassword
}
